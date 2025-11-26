import { useState, useEffect, useCallback } from "react";
import { logger } from "../utils";
import { SiteStatus } from "../popup/components/StatusIndicator";

interface SiteInfo {
  hostname: string;
  status: SiteStatus;
}

interface UseSiteDetectionOptions {
  isEnabled: boolean;
  blockedSites?: string[];
  safeSites?: string[];
}

export const useSiteDetection = ({
  isEnabled,
  blockedSites = ["example-harmful.com", "bad-site.com", "malware.com", "phishing-site.com"],
  safeSites = ["google.com", "youtube.com", "facebook.com", "github.com", "stackoverflow.com"]
}: UseSiteDetectionOptions) => {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    hostname: "loading...",
    status: "unknown"
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Site status detection logic
  const detectSiteStatus = useCallback((hostname: string, extensionEnabled: boolean): SiteStatus => {
    if (!extensionEnabled) return "unknown";
    
    // Check blocked sites
    if (blockedSites.includes(hostname)) return "blocked";
    
    // Check safe sites (including pattern matching)
    if (safeSites.includes(hostname) || 
        hostname.includes("google") || 
        hostname.includes("youtube") ||
        hostname.includes("github")) {
      return "protected";
    }
    
    return "unknown";
  }, [blockedSites, safeSites]);

  // Fetch current tab information
  const fetchCurrentTab = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if chrome APIs are available
      if (!chrome?.tabs?.query) {
        throw new Error("Chrome extension APIs not available");
      }

      const [activeTab] = await chrome.tabs.query({ 
        active: true, 
        currentWindow: true 
      });
      
      if (!activeTab?.url) {
        throw new Error("No active tab found");
      }

      const url = new URL(activeTab.url);
      const hostname = url.hostname;
      const status = detectSiteStatus(hostname, isEnabled);
      
      setSiteInfo({ hostname, status });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      logger.error("Failed to fetch current tab", err);
      setError(errorMessage);
      setSiteInfo({ hostname: "error", status: "unknown" });
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled, detectSiteStatus]);

  // Refresh site info when extension state changes
  const refreshSiteInfo = useCallback(() => {
    fetchCurrentTab();
  }, [fetchCurrentTab]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    fetchCurrentTab();
  }, [fetchCurrentTab]);

  // Listen for tab updates
  useEffect(() => {
    if (!chrome?.tabs?.onUpdated) return;

    const handleTabUpdate = (tabId: number, changeInfo: any) => {
      // Only refresh if URL changed
      if (changeInfo.url) {
        fetchCurrentTab();
      }
    };

    chrome.tabs.onUpdated.addListener(handleTabUpdate);
    
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdate);
    };
  }, [fetchCurrentTab]);

  // Listen for tab activation changes
  useEffect(() => {
    if (!chrome?.tabs?.onActivated) return;

    const handleTabActivation = () => {
      fetchCurrentTab();
    };

    chrome.tabs.onActivated.addListener(handleTabActivation);
    
    return () => {
      chrome.tabs.onActivated.removeListener(handleTabActivation);
    };
  }, [fetchCurrentTab]);

  return {
    siteInfo,
    isLoading,
    error,
    refreshSiteInfo,
    detectSiteStatus
  };
};

export default useSiteDetection;