/**
 * Early blur script - runs at document_start to blur images immediately
 * This script is intentionally minimal and runs before the main content script
 */

// Check if we're on Google Images - more flexible check
const isGoogleImagesPage = (): boolean => {
  try {
    const hostname = window.location.hostname;
    const search = window.location.search;
    const pathname = window.location.pathname;
    
    // Check for various Google domains and image search patterns
    const isGoogle = hostname.includes('google');
    const isImageSearch = search.includes('tbm=isch') || 
                          search.includes('udm=2') ||
                          pathname.includes('/imghp') ||
                          pathname.includes('/images');
    
    console.log('[XDynamic] URL check:', { hostname, pathname, search, isGoogle, isImageSearch });
    return isGoogle && (isImageSearch || pathname.includes('/search'));
  } catch {
    return false;
  }
};

// Function to blur an image
const blurImage = (img: HTMLImageElement): void => {
  if (img.dataset.xdynamicProcessed) return;
  img.dataset.xdynamicProcessed = 'blur';
  img.style.setProperty('filter', 'blur(15px)', 'important');
  img.style.setProperty('transition', 'filter 0.3s ease', 'important');
};

// Function to blur all existing images
const blurAllImages = (): void => {
  const images = document.querySelectorAll('img');
  images.forEach(img => blurImage(img as HTMLImageElement));
  console.log(`[XDynamic] Blurred ${images.length} existing images`);
};

// Only run on Google (we'll check for images search more loosely)
if (window.location.hostname.includes('google')) {
  console.log('[XDynamic] Early blur script running on Google');
  
  // Create and inject CSS immediately for strongest blur
  const style = document.createElement('style');
  style.id = 'xdynamic-early-blur';
  style.textContent = `
    /* Blur ALL images immediately - highest priority */
    img:not([data-xdynamic-safe="true"]):not([data-xdynamic-warned="true"]) {
      filter: blur(15px) !important;
    }
    
    /* Unblur safe images */
    img[data-xdynamic-safe="true"] {
      filter: none !important;
    }
    
    /* Keep blocked images blurred */
    img[data-xdynamic-blocked="true"] {
      filter: blur(25px) !important;
      opacity: 0.3 !important;
    }
    
    /* Warning images */
    img[data-xdynamic-warned="true"] {
      filter: none !important;
      outline: 3px solid orange !important;
    }
  `;
  
  // Insert style as early as possible
  const insertStyle = (): void => {
    const target = document.head || document.documentElement;
    if (target && !document.getElementById('xdynamic-early-blur')) {
      target.insertBefore(style, target.firstChild);
      console.log('[XDynamic] Early blur CSS injected');
    }
  };
  
  insertStyle();
  
  // Also blur images via JavaScript for extra safety
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      // Handle added nodes
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLImageElement) {
          blurImage(node);
        } else if (node instanceof HTMLElement) {
          const images = node.querySelectorAll('img');
          images.forEach(img => blurImage(img as HTMLImageElement));
        }
      }
    }
  });
  
  // Start observing as soon as body is available
  const startObserver = (): void => {
    if (document.body) {
      blurAllImages();
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      console.log('[XDynamic] MutationObserver started');
    } else {
      // Wait for body
      const bodyObserver = new MutationObserver(() => {
        if (document.body) {
          bodyObserver.disconnect();
          blurAllImages();
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          console.log('[XDynamic] MutationObserver started (delayed)');
        }
      });
      bodyObserver.observe(document.documentElement, { childList: true });
    }
  };
  
  // Try to start immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
  
  // Also run when head is available
  if (!document.head) {
    const headObserver = new MutationObserver(() => {
      if (document.head) {
        insertStyle();
        headObserver.disconnect();
      }
    });
    headObserver.observe(document.documentElement, { childList: true });
  }
}
