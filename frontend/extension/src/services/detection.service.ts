import { API_CONFIG } from '../core/config/api';
import { readFromStorage } from '../core/storage';
import { STORAGE_KEYS } from '../utils';
import { sendRuntimeMessage } from '../core/runtime/runtime';

export interface PredictionDetail {
  label: string;
  score: number;
  active: boolean;
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
   * Determine action based on predictions
   */
  private determineAction(predictions: PredictionDetail[]): 'block' | 'warn' | 'allow' {
    const maxScore = predictions.reduce(
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
    url: string
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
      action: this.determineAction(predictions),
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
   * Analyze image using backend API
   */
  async analyzeImage(
    url: string,
    context?: DetectionRequest["context"]
  ): Promise<DetectionResult> {
    if (this.shouldUseBackgroundProxy()) {
      try {
        const proxiedResult = await sendRuntimeMessage<DetectionResult>({
          type: "ANALYZE_IMAGE",
          url,
          context,
        });

        if (proxiedResult) {
          return proxiedResult;
        }
      } catch (error) {
        // Fall back to direct request below if proxy fails
        console.error("Background proxy failed:", error);
      }
    }

    try {
      const token = await this.getAuthToken();
      
      if (!token) {
        throw new Error('User not authenticated. Please login first.');
      }

      // Fetch image as File
      const imageFile = await this.fetchImageAsFile(url);
      
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
      
      return this.transformResponse(data, url);
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
   * Analyze video (not implemented yet)
   */
  async analyzeVideo(url: string, context?: any): Promise<DetectionResult> {
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
          : await this.analyzeVideo(request.url, request.context);
        
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
    throw new Error('Get result not supported - backend processes images synchronously');
  }
}

export const detectionService = new DetectionService();
