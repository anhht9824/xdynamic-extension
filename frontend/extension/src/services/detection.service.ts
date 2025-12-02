import { API_CONFIG } from '../core/config/api';
import { readFromStorage } from '../core/storage';
import { STORAGE_KEYS } from '../utils';
import { sendRuntimeMessage } from '../core/runtime/runtime';

export interface PredictionDetail {
  label: string;
  score: number;
  active: boolean;
}

// Mapping from backend class indices to filter keys
// Backend: ["0", "1", "2", "3"] -> ["Máu me", "Vũ khí", "Chiến tranh", "Nhạy cảm"]
// Frontend filters: sensitive, violence, toxicity, vice
const LABEL_TO_FILTER_MAP: Record<string, string> = {
  '0': 'violence',    // Máu me -> violence
  '1': 'toxicity',    // Vũ khí -> toxicity  
  '2': 'vice',        // Chiến tranh -> vice
  '3': 'sensitive',   // Nhạy cảm -> sensitive
  'Máu me': 'violence',
  'Vũ khí': 'toxicity',
  'Chiến tranh': 'vice',
  'Nhạy cảm': 'sensitive',
};

interface FilterState {
  sensitive: boolean;
  violence: boolean;
  toxicity: boolean;
  vice: boolean;
}

export interface DetectionRequest {
  url: string;
  type: 'image' | 'video';
  context?: {
    pageUrl: string;
    domain: string;
  };
}

export interface DetectionResult {
  id: string;
  url: string;
  type: 'image' | 'video';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  predictions?: PredictionDetail[];
  action: 'block' | 'warn' | 'allow';
  timestamp: string;
  quotaRemaining?: number;
  error?: string;
}

export interface BatchDetectionRequest {
  items: DetectionRequest[];
}

interface BackendPredictionResponse {
  classes: string[];
  probabilities: number[];
  active: string[];
  quota_remaining?: number;
}

export class DetectionService {
  /**
   * Convert image URL to File object
   */
  private async fetchImageAsFile(url: string): Promise<File> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Extract filename from URL or use default
      const urlObj = new URL(url);
      const filename = urlObj.pathname.split('/').pop() || 'image.jpg';
      
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      throw new Error(`Failed to fetch image: ${error}`);
    }
  }

  /**
   * Convert HTMLImageElement to File using canvas
   * This works for any image including base64, blob, or cross-origin images
   */
  private async imageElementToFile(img: HTMLImageElement): Promise<File> {
    return new Promise((resolve, reject) => {
      try {
        // Ensure image is loaded
        if (!img.complete || img.naturalWidth === 0) {
          reject(new Error('Image not fully loaded'));
          return;
        }

        const canvas = document.createElement('canvas');
        const width = img.naturalWidth || img.width || 200;
        const height = img.naturalHeight || img.height || 200;
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Try to draw the image - this may fail for cross-origin images
        try {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Test if we can read pixels (will throw if tainted)
          ctx.getImageData(0, 0, 1, 1);
        } catch (e) {
          // Canvas is tainted by cross-origin data
          reject(new Error('cross-origin image cannot be processed'));
          return;
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], 'image.jpg', { type: 'image/jpeg' }));
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, 'image/jpeg', 0.9);
      } catch (error) {
        reject(new Error(`Failed to convert image: ${error}`));
      }
    });
  }

  /**
   * Get image as File - tries multiple methods
   */
  private async getImageFile(url: string, imgElement?: HTMLImageElement): Promise<File> {
    // Method 1: Try canvas first if we have an image element (works for base64, same-origin)
    if (imgElement && imgElement.complete && imgElement.naturalWidth > 0) {
      try {
        const file = await this.imageElementToFile(imgElement);
        return file;
      } catch (error) {
        console.warn('Canvas method failed:', error);
        // Continue to other methods
      }
    }
    
    // Method 2: Try to get actual image URL from element attributes
    if (imgElement) {
      const actualUrl = imgElement.dataset.src || 
                        imgElement.dataset.iurl ||
                        imgElement.getAttribute('data-iurl') ||
                        imgElement.dataset.lazySrc;
      if (actualUrl && !actualUrl.startsWith('data:')) {
        try {
          return await this.fetchImageAsFile(actualUrl);
        } catch (error) {
          console.warn('Fetch from data-src failed:', error);
        }
      }
    }
    
    // Method 3: Fetch from URL if it's a regular URL
    if (url && !url.startsWith('data:') && !url.startsWith('google-thumb-') && !url.startsWith('base64-')) {
      try {
        return await this.fetchImageAsFile(url);
      } catch (error) {
        console.warn('Fetch from src failed:', error);
      }
    }
    
    // Method 4: Try current src directly if available
    if (imgElement?.src && !imgElement.src.startsWith('data:')) {
      try {
        return await this.fetchImageAsFile(imgElement.src);
      } catch (error) {
        console.warn('Fetch from img.src failed:', error);
      }
    }
    
    throw new Error('Unable to get image file - all methods failed');
  }

  /**
   * Get user filter settings from storage
   */
  private async getFilterSettings(): Promise<FilterState> {
    const filters = await readFromStorage<FilterState>(STORAGE_KEYS.FILTERS, 'sync');
    return filters || {
      sensitive: true,
      violence: true,
      toxicity: true,
      vice: true,
    };
  }

  /**
   * Determine action based on predictions and user filter settings
   */
  private determineAction(predictions: PredictionDetail[], filterSettings: FilterState): 'block' | 'warn' | 'allow' {
    // Only consider predictions for enabled filters
    const enabledPredictions = predictions.filter(pred => {
      const filterKey = LABEL_TO_FILTER_MAP[pred.label];
      if (!filterKey) return true; // Unknown label, consider it
      return filterSettings[filterKey as keyof FilterState] === true;
    });

    if (enabledPredictions.length === 0) {
      return 'allow';
    }

    const maxScore = enabledPredictions.reduce(
      (currentMax, item) => Math.max(currentMax, item.score),
      0
    );
    if (maxScore >= 0.8) return 'block';
    if (maxScore >= 0.5) return 'warn';
    return 'allow';
  }

  /**
   * Transform backend response to frontend format
   */
  private transformResponse(
    backendData: BackendPredictionResponse,
    url: string,
    filterSettings: FilterState
  ): DetectionResult {
    const probabilities = backendData.probabilities || [];
    const predictions: PredictionDetail[] = (backendData.classes || []).map(
      (label, index) => ({
        label,
        score: probabilities[index] ?? 0,
        active: (backendData.active || []).includes(label),
      })
    );

    return {
      id: `detection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      type: 'image',
      status: 'completed',
      predictions,
      action: this.determineAction(predictions, filterSettings),
      timestamp: new Date().toISOString(),
      quotaRemaining: backendData.quota_remaining,
    };
  }

  /**
   * Get auth token from storage
   */
  private async getAuthToken(): Promise<string | null> {
    const token = await readFromStorage<string>(STORAGE_KEYS.AUTH_TOKEN);
    return token ?? null;
  }

  /**
   * Decide whether to proxy through background (content scripts are subject to PNA/CORS)
   */
  private shouldUseBackgroundProxy(): boolean {
    try {
      const isExtensionPage =
        typeof location !== 'undefined' &&
        location.protocol === 'chrome-extension:';
      return !isExtensionPage && Boolean(chrome?.runtime?.id);
    } catch {
      return false;
    }
  }

  /**
   * Convert HTMLImageElement to base64 data URL using canvas
   */
  private imageElementToBase64(img: HTMLImageElement): string | null {
    try {
      if (!img.complete || img.naturalWidth === 0) {
        console.warn('Image not complete or has no natural width');
        return null;
      }

      // Skip very small images (likely icons or placeholders)
      if (img.naturalWidth < 50 || img.naturalHeight < 50) {
        console.warn('Image too small to process:', img.naturalWidth, 'x', img.naturalHeight);
        return null;
      }

      const canvas = document.createElement('canvas');
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      
      // Limit canvas size to avoid memory issues
      const maxSize = 1024;
      let scaledWidth = width;
      let scaledHeight = height;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        scaledWidth = Math.floor(width * ratio);
        scaledHeight = Math.floor(height * ratio);
      }
      
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return null;
      }
      
      // Try to draw the image
      try {
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        // Test if we can read pixels (will throw if tainted)
        ctx.getImageData(0, 0, 1, 1);
      } catch (e) {
        // Canvas is tainted by cross-origin data
        console.warn('Canvas tainted by cross-origin image');
        return null;
      }
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      
      // Validate the output
      if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length < 1000) {
        console.warn('Generated data URL is invalid or too small');
        return null;
      }
      
      return dataUrl;
    } catch (error) {
      console.warn('Failed to convert image to base64:', error);
      return null;
    }
  }

  /**
   * Analyze image using backend API
   * @param url - Image URL or identifier
   * @param context - Detection context (page URL, domain, etc.)
   * @param imgElement - Optional image element for canvas extraction
   * @param providedBase64 - Optional pre-extracted base64 data (e.g., from Google Images data URLs)
   */
  async analyzeImage(
    url: string,
    context?: DetectionRequest["context"],
    imgElement?: HTMLImageElement,
    providedBase64?: string
  ): Promise<DetectionResult> {
    // If running in content script context, use background proxy
    if (this.shouldUseBackgroundProxy()) {
      try {
        // Priority 1: Use provided base64 data (e.g., Google Images inline base64)
        if (providedBase64 && providedBase64.startsWith('data:image/')) {
          console.log('[Detection] Using provided base64 data');
          const proxiedResult = await sendRuntimeMessage<DetectionResult>({
            type: "ANALYZE_IMAGE_DATA",
            imageData: providedBase64,
            url,
            context,
          });
          if (proxiedResult) {
            return proxiedResult;
          }
        }
        
        // Priority 2: If we have an image element, try to convert to base64 via canvas
        if (imgElement) {
          const base64Data = this.imageElementToBase64(imgElement);
          if (base64Data) {
            console.log('[Detection] Using canvas-extracted base64 data');
            // Send base64 data to background for processing
            const proxiedResult = await sendRuntimeMessage<DetectionResult>({
              type: "ANALYZE_IMAGE_DATA",
              imageData: base64Data,
              url,
              context,
            });
            if (proxiedResult) {
              return proxiedResult;
            }
          }
        }
        
        // Priority 3: Send URL to background (background will fetch it)
        // Skip if URL doesn't look fetchable (e.g., custom identifiers)
        if (url && !url.startsWith('base64-') && !url.startsWith('container-') && !url.startsWith('google-thumb-')) {
          console.log('[Detection] Falling back to URL fetch via background:', url.substring(0, 50));
          const proxiedResult = await sendRuntimeMessage<DetectionResult>({
            type: "ANALYZE_IMAGE",
            url,
            context,
          });

          if (proxiedResult) {
            return proxiedResult;
          }
        }
        
        // All methods failed
        console.warn('[Detection] All proxy methods failed for:', url.substring(0, 50));
        return {
          id: `detection_failed_${Date.now()}`,
          url,
          type: 'image',
          status: 'failed',
          action: 'allow',
          timestamp: new Date().toISOString(),
          error: 'Could not process image - cross-origin or invalid URL',
        };
      } catch (error) {
        // Fall back to direct request below if proxy fails
        console.error("Background proxy failed:", error);
      }
    }

    // Direct API call (when running in background script or extension pages)
    try {
      const token = await this.getAuthToken();
      
      if (!token) {
        throw new Error('User not authenticated. Please login first.');
      }

      // Get image as File - use canvas for imgElement or fetch for URLs
      const imageFile = await this.getImageFile(url, imgElement);
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('threshold', '0.5');

      // Call backend API with multipart/form-data
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 403) {
          throw new Error('Quota exceeded. Please upgrade your plan.');
        }
        
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const data: BackendPredictionResponse = await response.json();
      
      // Get filter settings and apply to action determination
      const filterSettings = await this.getFilterSettings();
      return this.transformResponse(data, url, filterSettings);
    } catch (error) {
      console.error('Detection failed:', error);
      
      return {
        id: `detection_error_${Date.now()}`,
        url,
        type: 'image',
        status: 'failed',
        action: 'allow',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Convert base64 data URL to File with validation
   */
  private base64ToFile(base64Data: string, filename: string = 'image.jpg'): File | null {
    try {
      // Validate input
      if (!base64Data || typeof base64Data !== 'string') {
        console.warn('Invalid base64 data: empty or not a string');
        return null;
      }

      // Check if it's a valid data URL
      if (!base64Data.startsWith('data:image/')) {
        console.warn('Invalid base64 data: not an image data URL');
        return null;
      }

      // Remove data URL prefix if present
      const base64Content = base64Data.includes(',') 
        ? base64Data.split(',')[1] 
        : base64Data;
      
      if (!base64Content || base64Content.length < 100) {
        console.warn('Invalid base64 data: content too short');
        return null;
      }

      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      if (byteArray.length < 100) {
        console.warn('Invalid base64 data: decoded content too small');
        return null;
      }

      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      return new File([blob], filename, { type: 'image/jpeg' });
    } catch (error) {
      console.warn('Failed to convert base64 to file:', error);
      return null;
    }
  }

  /**
   * Analyze image with base64 data (called from background script)
   */
  async analyzeImageWithData(
    imageData: string,
    url: string
  ): Promise<DetectionResult> {
    try {
      const token = await this.getAuthToken();
      
      if (!token) {
        throw new Error('User not authenticated. Please login first.');
      }

      // Convert base64 to File
      const imageFile = this.base64ToFile(imageData);
      
      if (!imageFile) {
        // Return early if conversion failed - this is not a blockable situation
        return {
          id: `detection_skip_${Date.now()}`,
          url,
          type: 'image',
          status: 'failed',
          action: 'allow',
          timestamp: new Date().toISOString(),
          error: 'Failed to convert image data',
        };
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('threshold', '0.5');

      // Call backend API with multipart/form-data
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/predict`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 403) {
          throw new Error('Quota exceeded. Please upgrade your plan.');
        }
        
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const data: BackendPredictionResponse = await response.json();
      
      // Get filter settings and apply to action determination
      const filterSettings = await this.getFilterSettings();
      return this.transformResponse(data, url, filterSettings);
    } catch (error) {
      console.error('Detection with data failed:', error);
      
      return {
        id: `detection_error_${Date.now()}`,
        url,
        type: 'image',
        status: 'failed',
        action: 'allow',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Analyze video (not implemented yet)
   */
  async analyzeVideo(url: string): Promise<DetectionResult> {
    // TODO: Implement video analysis when backend supports it
    return {
      id: `detection_${Date.now()}`,
      url,
      type: 'video',
      status: 'failed',
      action: 'allow',
      timestamp: new Date().toISOString(),
      error: 'Video analysis not implemented yet',
    };
  }

  /**
   * Batch analyze multiple items
   */
  async batchAnalyze(requests: DetectionRequest[]): Promise<DetectionResult[]> {
    // Process sequentially to avoid quota issues
    const results: DetectionResult[] = [];
    
    for (const request of requests) {
      try {
        const result = request.type === 'image' 
          ? await this.analyzeImage(request.url, request.context)
          : await this.analyzeVideo(request.url);
        
        results.push(result);
      } catch (error) {
        results.push({
          id: `detection_error_${Date.now()}`,
          url: request.url,
          type: request.type,
          status: 'failed',
          action: 'allow',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
    
    return results;
  }

  /**
   * Get result (mock - backend doesn't store results)
   */
  async getResult(id: string): Promise<DetectionResult> {
    void id;
    throw new Error('Get result not supported - backend processes images synchronously');
  }
}

export const detectionService = new DetectionService();
