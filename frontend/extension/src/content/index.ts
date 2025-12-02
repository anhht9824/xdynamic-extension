import { logger, STORAGE_KEYS } from "../utils";
import { detectionService } from "../services/detection.service";
import {
  addRuntimeMessageListener,
  sendRuntimeMessage,
} from "../core/runtime/runtime";
import { readFromStorage } from "../core/storage";
import type { DetectionResult } from "../services/detection.service";
import type { RuntimeMessage, ScanConfig } from "../core/runtime/messageTypes";

logger.info("Content script loaded - XDynamic Extension");

document.documentElement.setAttribute("data-xdynamic-loaded", "true");

// Note: Early blur CSS is injected by early-blur.ts which runs at document_start

const processedImages = new Set<string>();

const scanConfig: ScanConfig = {
  enabled: true,
  blockThreshold: 0.8,
  warnThreshold: 0.5,
  maxImagesPerScan: Number.POSITIVE_INFINITY,
  scanDelay: 100, // Reduced delay for faster scanning
};

let isPageBlocked = false;

const isExtensionContextValid = (): boolean => {
  try {
    return Boolean(chrome?.runtime?.id);
  } catch (error) {
    logger.error("Extension context invalidated. Please refresh the page.", error);
    return false;
  }
};

const showReloadBanner = (): void => {
  if (document.getElementById("xdynamic-reload-banner")) {
    return;
  }

  const banner = document.createElement("div");
  banner.id = "xdynamic-reload-banner";
  banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff6b6b;
      color: white;
      padding: 12px;
      text-align: center;
      z-index: 999999;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
  banner.innerHTML = `
      XDynamic Extension was updated. Please <strong>refresh this page (F5)</strong> to continue.
      <button onclick="location.reload()" style="margin-left: 10px; padding: 4px 12px; background: white; color: #ff6b6b; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Refresh Now</button>
    `;
  document.body?.appendChild(banner);
};

const ensureValidContext = (): boolean => {
  if (isExtensionContextValid()) {
    return true;
  }

  logger.warn(
    "Extension was reloaded. Please refresh this page (F5) for content script to work."
  );
  showReloadBanner();
  return false;
};

const normalizePattern = (pattern: string): string => {
  const trimmed = (pattern || "").trim();
  if (!trimmed) return "";

  const withProtocol = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return trimmed
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/^www\./, "")
      .toLowerCase();
  }
};

const normalizeHostname = (hostname: string): string =>
  (hostname || "").replace(/^www\./, "").toLowerCase();

const matchesPattern = (hostname: string, _fullUrl: string, pattern: string): boolean => {
  const normalizedPattern = normalizePattern(pattern);
  const normalizedHostname = normalizeHostname(hostname);
  if (!normalizedPattern || !normalizedHostname) return false;

  if (normalizedPattern.startsWith("*.")) {
    const base = normalizedPattern.slice(2);
    return normalizedHostname === base || normalizedHostname.endsWith(`.${base}`);
  }

  return normalizedHostname === normalizedPattern;
};

const readBlacklistFrom = async (area: "sync" | "local"): Promise<string[]> => {
  const list = await readFromStorage<string[]>(STORAGE_KEYS.BLACKLIST, area);
  return Array.isArray(list) ? list.filter(Boolean) : [];
};

const getBlacklist = async (): Promise<string[]> => {
  try {
    const syncList = await readBlacklistFrom("sync");
    if (syncList.length) return syncList;
  } catch (error) {
    logger.warn("Failed to read blacklist from sync storage", error);
  }

  try {
    const localList = await readBlacklistFrom("local");
    if (localList.length) return localList;
  } catch (error) {
    logger.warn("Failed to read blacklist from local storage", error);
  }
  return [];
};

const applyBlacklistOverlay = (pattern: string): void => {
  const existing = document.getElementById("xdynamic-blacklist-overlay");
  if (existing) {
    return;
  }

  const attachOverlay = () => {
    const overlay = document.createElement("div");
    overlay.id = "xdynamic-blacklist-overlay";
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background:
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08), rgba(9, 12, 24, 0.98)),
        radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.12), rgba(7, 10, 20, 0.98)),
        rgba(5, 8, 16, 0.98);
      color: #e2e8f0;
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 32px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      backdrop-filter: blur(10px) brightness(0.6);
      pointer-events: all;
      width: 100vw;
      height: 100vh;
    `;

    const card = document.createElement("div");
    card.style.cssText = `
      max-width: 520px;
      width: 100%;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(148, 163, 184, 0.3);
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 15px 60px rgba(0,0,0,0.35);
    `;

    card.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; margin-bottom:16px;">
        <div style="width:52px; height:52px; border-radius:16px; background:#ef4444; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 30px rgba(239,68,68,0.35);">
          <span style="font-size:26px;" aria-hidden="true">🚫</span>
        </div>
      </div>
      <h2 style="font-size:22px; font-weight:800; margin:0 0 12px;">Trang này đã bị chặn</h2>
      <p style="margin:0 0 8px; color:#cbd5e1; font-size:15px;">Domain hiện tại khớp với blacklist của bạn.</p>
      <p style="margin:0 0 16px; color:#e2e8f0; font-weight:600;">Mẫu chặn: <code style="background:#0f172a; padding:4px 8px; border-radius:8px; border:1px solid rgba(148, 163, 184, 0.25);">${pattern}</code></p>
      <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-top:10px;">
        <button id="xdynamic-leave-btn" style="padding:10px 16px; border-radius:10px; background:#ef4444; color:#fff; border:none; font-weight:700; cursor:pointer; box-shadow:0 10px 20px rgba(239,68,68,0.35);">
          Rời khỏi trang
        </button>
        <button id="xdynamic-settings-btn" style="padding:10px 16px; border-radius:10px; background:rgba(148, 163, 184, 0.15); color:#e2e8f0; border:1px solid rgba(148, 163, 184, 0.35); font-weight:700; cursor:pointer;">
          Mở cài đặt (giữ nguyên chặn)
        </button>
      </div>
    `;

    overlay.appendChild(card);
    document.body?.appendChild(overlay);
    document.documentElement.style.overflow = "hidden";

    const leaveBtn = document.getElementById("xdynamic-leave-btn");
    leaveBtn?.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.replace("about:blank");
      }
    });

    const settingsBtn = document.getElementById("xdynamic-settings-btn");
    settingsBtn?.addEventListener("click", () => {
      try {
        chrome.runtime?.openOptionsPage?.();
      } catch (error) {
        logger.error("Failed to open options page:", error);
      }
    });
  };

  if (document.body) {
    attachOverlay();
  } else {
    document.addEventListener("DOMContentLoaded", attachOverlay, { once: true });
  }
};

const checkAndBlockCurrentPage = async (): Promise<boolean> => {
  if (location.protocol === "chrome-extension:") return false;
  const hostname = normalizeHostname(window.location.hostname);
  const fullUrl = window.location.href.toLowerCase();
  const blacklist = await getBlacklist();

  const matchedPattern = blacklist.find((pattern) => matchesPattern(hostname, fullUrl, pattern));
  if (matchedPattern) {
    isPageBlocked = true;
    applyBlacklistOverlay(matchedPattern);
    logger.warn("Page blocked by blacklist", { hostname, matchedPattern });
    return true;
  }

  return false;
};

const isExtensionEnabled = async (): Promise<boolean> => {
  if (!isExtensionContextValid()) return false;
  const enabled = await readFromStorage<boolean>(STORAGE_KEYS.EXTENSION_ENABLED);
  return enabled !== false;
};

const isUserAuthenticated = async (): Promise<boolean> => {
  if (!isExtensionContextValid()) return false;
  const token = await readFromStorage<string>(STORAGE_KEYS.AUTH_TOKEN);
  return Boolean(token);
};

const markBlocked = (img: HTMLImageElement, result: DetectionResult): void => {
  img.style.filter = "blur(20px)";
  img.style.opacity = "0.3";
  img.dataset.xdynamicBlocked = "true";
  img.dataset.xdynamicReason = JSON.stringify(result.predictions);
  img.title = "Click to reveal (Sensitive content detected)";
  img.style.cursor = "pointer";

  img.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      if (
        confirm(
          "This image may contain sensitive content. Do you want to view it?"
        )
      ) {
        img.style.filter = "none";
        img.style.opacity = "1";
        img.title = "Sensitive content revealed";
      }
    },
    { once: true }
  );
};

const markWarned = (img: HTMLImageElement, result: DetectionResult): void => {
  img.dataset.xdynamicWarned = "true";
  img.dataset.xdynamicReason = JSON.stringify(result.predictions);
  img.title = "Potentially sensitive content";
  img.style.border = "3px solid orange";
};

/**
 * Add click-to-reveal functionality for images that couldn't be scanned
 */
const addClickToReveal = (img: HTMLImageElement, message: string): void => {
  if (img.dataset.xdynamicClickable) return; // Already added
  
  img.dataset.xdynamicClickable = "true";
  img.title = message;
  img.style.cursor = "pointer";
  
  img.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      // Mark as safe to remove blur
      img.dataset.xdynamicSafe = "true";
      img.title = "Image revealed (not scanned)";
      img.style.cursor = "";
    },
    { once: true }
  );
};

/**
 * Get unique identifier for an image (for tracking processed images)
 */
const getImageIdentifier = (img: HTMLImageElement): string | null => {
  // Use src if available (even base64 truncated)
  if (img.src) {
    // For base64, use first 100 chars + length as identifier
    if (img.src.startsWith('data:')) {
      return `base64-${img.src.substring(0, 100)}-${img.src.length}`;
    }
    return img.src;
  }
  
  // Use data-src as fallback
  if (img.dataset.src) {
    return img.dataset.src;
  }
  
  // Use parent data-id for Google Images
  const parent = img.closest('[data-id]');
  if (parent) {
    return `container-${parent.getAttribute('data-id')}`;
  }
  
  return null;
};

/**
 * Get fetchable URL for an image (URL that can be fetched by background script)
 */
const getFetchableUrl = (img: HTMLImageElement): string | null => {
  // For Google Images, try to find the original image URL
  if (isGoogleImages()) {
    // Method 1: Check parent anchor for href with actual image URL
    const anchor = img.closest('a[href]') as HTMLAnchorElement | null;
    if (anchor?.href) {
      try {
        const url = new URL(anchor.href);
        const imgUrl = url.searchParams.get('imgurl');
        if (imgUrl) {
          return imgUrl;
        }
      } catch {}
    }
    
    // Method 2: Check for data-iurl attribute
    const dataIurl = img.getAttribute('data-iurl') || img.dataset.iurl;
    if (dataIurl && !dataIurl.startsWith('data:') && !dataIurl.includes('encrypted-')) {
      return dataIurl;
    }
    
    // Method 3: Check data-src
    if (img.dataset.src && !img.dataset.src.startsWith('data:') && !img.dataset.src.includes('encrypted-')) {
      return img.dataset.src;
    }
    
    // Method 4: If src is a regular URL (not base64 or encrypted)
    if (img.src && !img.src.startsWith('data:') && !img.src.includes('encrypted-')) {
      return img.src;
    }
    
    // No fetchable URL available for Google Images thumbnails
    return null;
  }
  
  // For non-Google sites
  const imageUrl = img.src || img.dataset.src || img.dataset.lazySrc;
  if (!imageUrl) return null;
  
  // Skip blob URLs
  if (imageUrl.startsWith("blob:")) return null;
  
  // Skip base64 (not fetchable)
  if (imageUrl.startsWith("data:")) return null;
  
  return imageUrl;
};

/**
 * Check if image has base64 data that can be sent directly
 */
const getBase64Data = (img: HTMLImageElement): string | null => {
  // Check if src is base64
  if (img.src?.startsWith('data:image/')) {
    return img.src;
  }
  
  // Check data-src
  if (img.dataset.src?.startsWith('data:image/')) {
    return img.dataset.src;
  }
  
  return null;
};

/**
 * Check if image element should be scanned (is visible and large enough)
 */
const shouldScanImage = (img: HTMLImageElement): boolean => {
  // For Google Images, be more lenient with size requirements
  const minSize = isGoogleImages() ? 30 : 50;
  
  // Check natural dimensions first
  if (img.naturalWidth >= minSize && img.naturalHeight >= minSize) {
    return true;
  }
  
  // Check displayed dimensions as fallback
  if (img.width >= minSize && img.height >= minSize) {
    return true;
  }
  
  // Check if image hasn't loaded yet
  if (!img.complete) {
    return true; // Will be checked again after load
  }
  
  return false;
};

/**
 * Check if we're on Google Images
 */
const isGoogleImages = (): boolean => {
  return window.location.hostname.includes('google') && 
         (window.location.pathname.includes('/search') && window.location.search.includes('tbm=isch'));
};

/**
 * Get all scannable images including Google Images specific elements
 */
const getAllScannableImages = (): HTMLImageElement[] => {
  const images: HTMLImageElement[] = [];
  
  // Standard img tags
  const standardImgs = document.querySelectorAll<HTMLImageElement>('img');
  standardImgs.forEach(img => images.push(img));
  
  // For Google Images, look for thumbnail containers
  if (isGoogleImages()) {
    // Google Images thumbnail containers
    const googleThumbnails = document.querySelectorAll('[data-id]');
    googleThumbnails.forEach(container => {
      const img = container.querySelector('img') as HTMLImageElement | null;
      if (img && !images.includes(img)) {
        images.push(img);
      }
    });
    
    // Also look for images in divs with specific classes used by Google
    const googleImgDivs = document.querySelectorAll('div[data-ved] img, a[data-ved] img');
    googleImgDivs.forEach(img => {
      if (img instanceof HTMLImageElement && !images.includes(img)) {
        images.push(img);
      }
    });
  }
  
  return images;
};

const notifyDetection = async (result: DetectionResult): Promise<void> => {
  if (!isExtensionContextValid()) return;

  try {
    await sendRuntimeMessage({ type: "DETECTION_RESULT", data: result });
  } catch (error) {
    logger.error("Failed to send message to background:", error);
  }
};

const scanImage = async (img: HTMLImageElement): Promise<void> => {
  // Skip if already processed with result
  if (img.dataset.xdynamicBlocked || img.dataset.xdynamicWarned) {
    return;
  }
  
  // Get unique identifier for tracking processed images
  const imageId = getImageIdentifier(img);
  if (!imageId) return;
  
  // For Google Images, we may need to re-scan if image wasn't ready before
  const wasScannedBefore = processedImages.has(imageId);
  const isGoogleImg = isGoogleImages();
  
  // Skip if already processed (unless it's Google Images and image wasn't complete before)
  if (wasScannedBefore && !isGoogleImg) return;
  if (wasScannedBefore && img.dataset.xdynamicScanned === 'complete') return;
  
  // Wait for image to be ready
  if (!img.complete || img.naturalWidth === 0) {
    await new Promise<void>((resolve) => {
      const onLoad = () => {
        img.removeEventListener('error', onError);
        resolve();
      };
      const onError = () => {
        img.removeEventListener('load', onLoad);
        resolve();
      };
      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', onError, { once: true });
      // Timeout after 5 seconds
      setTimeout(() => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
        resolve();
      }, 5000);
    });
  }
  
  // Check if image should be scanned (size requirements)
  if (!shouldScanImage(img)) {
    return;
  }
  
  // Double check image is actually ready
  if (!img.complete || img.naturalWidth === 0) {
    logger.warn(`Image not ready for scanning: ${imageId.substring(0, 50)}...`);
    return;
  }

  processedImages.add(imageId);
  img.dataset.xdynamicScanned = "pending";

  try {
    // Get fetchable URL if available
    const fetchableUrl = getFetchableUrl(img);
    // Get base64 data if image src is already base64
    const base64Data = getBase64Data(img);
    
    // Debug logging for Google Images
    if (isGoogleImages()) {
      logger.info(`[Google Images Debug] Image src type: ${img.src?.substring(0, 30)}...`);
      logger.info(`[Google Images Debug] Has base64: ${!!base64Data}, Has fetchable URL: ${!!fetchableUrl}`);
      if (fetchableUrl) {
        logger.info(`[Google Images Debug] Fetchable URL: ${fetchableUrl.substring(0, 80)}...`);
      }
    }
    
    // Log what we're working with
    const urlForLog = fetchableUrl || base64Data?.substring(0, 50) || imageId;
    logger.info(`Scanning image: ${urlForLog.substring(0, 100)}...`);

    // Pass both URL and image element to detection service
    // Service will try: 1) canvas, 2) base64 direct send, 3) URL fetch via background
    const result = await detectionService.analyzeImage(
      fetchableUrl || imageId, 
      {
        pageUrl: window.location.href,
        domain: window.location.hostname,
      },
      img, // Pass the image element for canvas method
      base64Data || undefined // Pass base64 data if available
    );

    logger.info("Scan result:", result);

    if (result.status === "completed" && result.predictions) {
      switch (result.action) {
        case "block":
          markBlocked(img, result);
          logger.warn(`Blocked image: ${urlForLog}`, result.predictions);
          break;
        case "warn":
          markWarned(img, result);
          logger.warn(`Warned about image: ${urlForLog}`, result.predictions);
          // Mark as safe to remove CSS blur, but keep warning border
          img.dataset.xdynamicSafe = "true";
          if (img.dataset.xdynamicPending) {
            delete img.dataset.xdynamicPending;
          }
          break;
        case "allow":
          logger.info(`Allowed image: ${urlForLog}`);
          // Mark as safe to remove CSS blur
          img.dataset.xdynamicSafe = "true";
          if (img.dataset.xdynamicPending) {
            delete img.dataset.xdynamicPending;
          }
          break;
      }

      await notifyDetection(result);
    } else if (result.status === "failed") {
      // If scan failed (e.g., cross-origin), add click-to-reveal on Google Images
      if (isGoogleImages()) {
        logger.warn(`Scan failed, adding click-to-reveal: ${urlForLog.substring(0, 50)}...`);
        addClickToReveal(img, "Could not scan this image. Click to reveal.");
      } else {
        // For non-Google sites, mark as safe on failure (allow by default)
        img.dataset.xdynamicSafe = "true";
        if (img.dataset.xdynamicPending) {
          delete img.dataset.xdynamicPending;
        }
      }
    }
    
    // Mark as completely scanned
    img.dataset.xdynamicScanned = "complete";
  } catch (error) {
    logger.error(`Failed to scan image ${imageId}:`, error);
    
    // On Google Images, add click-to-reveal for failed scans
    if (isGoogleImages()) {
      logger.warn(`Error scanning, adding click-to-reveal: ${imageId.substring(0, 50)}...`);
      addClickToReveal(img, "Could not scan this image. Click to reveal.");
      img.dataset.xdynamicScanned = "failed";
    } else {
      // For other sites, mark as safe and allow retry
      img.dataset.xdynamicSafe = "true";
      if (img.dataset.xdynamicPending) {
        delete img.dataset.xdynamicPending;
      }
      processedImages.delete(imageId);
      img.dataset.xdynamicScanned = "";
    }
  }
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const scanPage = async (): Promise<void> => {
  if (!ensureValidContext()) {
    return;
  }

  if (await checkAndBlockCurrentPage()) {
    return;
  }

  const enabled = await isExtensionEnabled();
  if (!enabled) {
    logger.info("Extension is disabled");
    return;
  }

  const authenticated = await isUserAuthenticated();
  if (!authenticated) {
    logger.warn("User not authenticated - skipping scan");
    return;
  }

  logger.info("Starting page scan...");

  // Use enhanced image finder that handles Google Images
  const images = getAllScannableImages();
  let scannedCount = 0;
  
  // CSS already handles pre-blur on Google Images, just mark as pending
  const isGoogleImg = isGoogleImages();
  if (isGoogleImg) {
    for (const img of images) {
      if (!img.dataset.xdynamicBlocked && !img.dataset.xdynamicWarned && !img.dataset.xdynamicScanned && !img.dataset.xdynamicSafe) {
        img.dataset.xdynamicPending = "true";
      }
    }
  }

  for (const img of images) {
    if (
      Number.isFinite(scanConfig.maxImagesPerScan) &&
      scannedCount >= scanConfig.maxImagesPerScan
    ) {
      logger.info(`Reached max images per scan (${scanConfig.maxImagesPerScan})`);
      break;
    }

    if (img.dataset.xdynamicBlocked || img.dataset.xdynamicWarned) continue;

    await scanImage(img);
    scannedCount++;

    if (scannedCount < images.length) {
      await delay(scanConfig.scanDelay);
    }
  }

  logger.info(`Page scan completed. Scanned ${scannedCount} images.`);
};

const observeDOMChanges = (): void => {
  if (!document.body) return;

  // Track images that are being scanned to avoid double-scanning
  const scanningImages = new Set<HTMLImageElement>();

  const observer = new MutationObserver(async (mutations) => {
    if (!ensureValidContext()) {
      observer.disconnect();
      return;
    }

    if (isPageBlocked) return;

    const enabled = await isExtensionEnabled();
    const authenticated = await isUserAuthenticated();

    if (!enabled || !authenticated) return;

    const imagesToScan: HTMLImageElement[] = [];

    for (const mutation of mutations) {
      // Handle added nodes
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLImageElement) {
          if (!scanningImages.has(node)) {
            imagesToScan.push(node);
          }
        } else if (node instanceof HTMLElement) {
          // For Google Images and other sites with lazy loading
          const images = node.querySelectorAll<HTMLImageElement>("img");
          for (const img of images) {
            if (!scanningImages.has(img)) {
              imagesToScan.push(img);
            }
          }
        }
      }
      
      // Handle attribute changes (for lazy-loaded images that update src)
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLImageElement) {
        const img = mutation.target;
        if (!scanningImages.has(img)) {
          const imageId = getImageIdentifier(img);
          if (imageId && !processedImages.has(imageId)) {
            imagesToScan.push(img);
          }
        }
      }
    }

    // CSS already handles pre-blur on Google Images, just mark as pending
    if (isGoogleImages()) {
      for (const img of imagesToScan) {
        if (!img.dataset.xdynamicBlocked && !img.dataset.xdynamicWarned && !img.dataset.xdynamicScanned && !img.dataset.xdynamicSafe) {
          img.dataset.xdynamicPending = "true";
        }
      }
    }

    // Scan all new images
    for (const img of imagesToScan) {
      scanningImages.add(img);
      try {
        await scanImage(img);
      } finally {
        scanningImages.delete(img);
        // Note: pre-blur removal is handled inside scanImage based on result
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'data-src', 'data-lazy-src'],
  });

  logger.info("DOM observer initialized");
};

const handleRuntimeMessage = (
  message: RuntimeMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: { success: boolean; error?: string }) => void
): boolean => {
  if (!ensureValidContext()) {
    sendResponse({ success: false, error: "Extension context invalidated" });
    return false;
  }

  switch (message.type) {
    case "SCAN_PAGE":
      scanPage()
        .then(() => sendResponse({ success: true }))
        .catch((error: Error) =>
          sendResponse({ success: false, error: error.message })
        );
      return true;
    case "TOGGLE_EXTENSION":
      scanConfig.enabled = message.enabled;
      sendResponse({ success: true });
      return false;
    case "UPDATE_CONFIG":
      Object.assign(scanConfig, message.config);
      sendResponse({ success: true });
      return false;
    default:
      return false;
  }
};

addRuntimeMessageListener(handleRuntimeMessage);

/**
 * Debounce function for scroll handling
 */
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Handle scroll events to scan newly visible images
 */
const handleScroll = debounce(async () => {
  if (!ensureValidContext()) return;
  
  const enabled = await isExtensionEnabled();
  const authenticated = await isUserAuthenticated();
  
  if (!enabled || !authenticated) return;
  
  // Scan visible images that haven't been processed yet
  const images = getAllScannableImages();
  for (const img of images) {
    if (img.dataset.xdynamicBlocked || img.dataset.xdynamicWarned) continue;
    const imageId = getImageIdentifier(img);
    if (imageId && !processedImages.has(imageId)) {
      // Check if image is in viewport
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        await scanImage(img);
      }
    }
  }
}, 300);

const initialize = (): void => {
  const startScanning = () => {
    scanPage();
    observeDOMChanges();
    // Add scroll listener for lazy-loaded images
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // For Google Images: Re-scan after a short delay to catch images that loaded late
    if (isGoogleImages()) {
      // First retry after 500ms
      setTimeout(() => {
        logger.info('Google Images: Re-scanning after 500ms...');
        scanPage();
      }, 500);
      
      // Second retry after 1.5s for any remaining images
      setTimeout(() => {
        logger.info('Google Images: Re-scanning after 1.5s...');
        scanPage();
      }, 1500);
      
      // Third retry after 3s for very slow loading
      setTimeout(() => {
        logger.info('Google Images: Final re-scan after 3s...');
        scanPage();
      }, 3000);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startScanning);
  } else {
    startScanning();
  }

  // Also scan when window fully loads (all images loaded)
  window.addEventListener('load', () => {
    logger.info('Window loaded: Re-scanning page...');
    scanPage();
  });

  logger.info("Content script initialized successfully");
};

initialize();
