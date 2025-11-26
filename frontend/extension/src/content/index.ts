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

const processedImages = new Set<string>();

const scanConfig: ScanConfig = {
  enabled: true,
  blockThreshold: 0.8,
  warnThreshold: 0.5,
  maxImagesPerScan: Number.POSITIVE_INFINITY,
  scanDelay: 500,
};

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

const getImageUrl = (img: HTMLImageElement): string | null => {
  const imageUrl = img.src || img.dataset.src;
  if (!imageUrl) return null;
  if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) return null;
  return imageUrl;
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
  const imageUrl = getImageUrl(img);
  if (!imageUrl || processedImages.has(imageUrl)) return;
  if (img.naturalWidth < 50 || img.naturalHeight < 50) return;

  processedImages.add(imageUrl);

  try {
    logger.info(`Scanning image: ${imageUrl}`);

    const result = await detectionService.analyzeImage(imageUrl, {
      pageUrl: window.location.href,
      domain: window.location.hostname,
    });

    logger.info("Scan result:", result);

    if (result.status === "completed" && result.predictions) {
      switch (result.action) {
        case "block":
          markBlocked(img, result);
          logger.warn(`Blocked image: ${imageUrl}`, result.predictions);
          break;
        case "warn":
          markWarned(img, result);
          logger.warn(`Warned about image: ${imageUrl}`, result.predictions);
          break;
        case "allow":
          logger.info(`Allowed image: ${imageUrl}`);
          break;
      }

      await notifyDetection(result);
    }
  } catch (error) {
    logger.error(`Failed to scan image ${imageUrl}:`, error);
    processedImages.delete(imageUrl);
  }
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const scanPage = async (): Promise<void> => {
  if (!ensureValidContext()) {
    return;
  }

  const enabled = await isExtensionEnabled();
  const authenticated = await isUserAuthenticated();

  if (!enabled) {
    logger.info("Extension is disabled");
    return;
  }

  if (!authenticated) {
    logger.warn("User not authenticated - skipping scan");
    return;
  }

  logger.info("Starting page scan...");

  const images = document.querySelectorAll<HTMLImageElement>("img");
  let scannedCount = 0;

  for (const img of Array.from(images)) {
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

  const observer = new MutationObserver(async (mutations) => {
    if (!ensureValidContext()) {
      observer.disconnect();
      return;
    }

    const enabled = await isExtensionEnabled();
    const authenticated = await isUserAuthenticated();

    if (!enabled || !authenticated) return;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLImageElement) {
          await scanImage(node);
        } else if (node instanceof HTMLElement) {
          const images = node.querySelectorAll<HTMLImageElement>("img");
          for (const img of images) {
            await scanImage(img);
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
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

const initialize = (): void => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      scanPage();
      observeDOMChanges();
    });
  } else {
    scanPage();
    observeDOMChanges();
  }

  logger.info("Content script initialized successfully");
};

initialize();
