/**
 * Navigation helpers for Chrome Extension pages
 */

import { EXTENSION_PAGES } from "./constants";
import { logger } from "./logger";

const buildUrl = (
  page: keyof typeof EXTENSION_PAGES,
  queryParams?: Record<string, string>
): string => {
  let url = chrome.runtime.getURL(EXTENSION_PAGES[page]);

  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url += `?${params.toString()}`;
  }

  return url;
};

export const navigateToPage = (
  page: keyof typeof EXTENSION_PAGES,
  queryParams?: Record<string, string>
): void => {
  try {
    const url = buildUrl(page, queryParams);

    chrome.tabs.create({ url }, (tab) => {
      if (chrome.runtime.lastError) {
        logger.error("Failed to open tab", chrome.runtime.lastError);
      } else {
        logger.debug("Tab created successfully", tab?.id);
      }
    });

    logger.debug(`Navigating to ${page}`, { url, queryParams });
  } catch (error) {
    logger.error(`Failed to navigate to ${page}`, error);
  }
};

export const navigateToPageInCurrentTab = async (
  page: keyof typeof EXTENSION_PAGES,
  queryParams?: Record<string, string>
): Promise<void> => {
  try {
    const url = buildUrl(page, queryParams);
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab?.id) {
      await chrome.tabs.update(tab.id, { url });
      logger.debug(`Navigating current tab to ${page}`, { url, queryParams });
    }
  } catch (error) {
    logger.error(`Failed to navigate current tab to ${page}`, error);
  }
};

export const getPageUrl = (
  page: keyof typeof EXTENSION_PAGES,
  queryParams?: Record<string, string>
): string => buildUrl(page, queryParams);

export const redirectToPage = (
  page: keyof typeof EXTENSION_PAGES,
  queryParams?: Record<string, string>
): void => {
  try {
    const url = buildUrl(page, queryParams);
    logger.debug(`Redirecting to ${page}`, { url, queryParams });
    window.location.href = url;
  } catch (error) {
    logger.error(`Failed to redirect to ${page}`, error);
    throw error;
  }
};
