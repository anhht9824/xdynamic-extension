/**
 * Window management utilities
 */

import { logger } from './logger';
import { getPageUrl } from './navigation';

/**
 * Safely close the current window with fallback
 * If window.close() fails (e.g., not opened via script), redirects to dashboard
 */
export const safeCloseWindow = (): void => {
  try {
    // Check if window was opened by script (has opener)
    if (window.opener) {
      window.close();
      logger.debug('Window closed successfully');
    } else {
      // Fallback: redirect to dashboard
      logger.debug('Cannot close window, redirecting to dashboard');
      window.location.href = getPageUrl('DASHBOARD');
    }
  } catch (error) {
    logger.error('Failed to close window, redirecting to dashboard', error);
    window.location.href = getPageUrl('DASHBOARD');
  }
};

/**
 * Close window and optionally redirect
 * @param fallbackPage - Page to redirect to if close fails (default: DASHBOARD)
 */
export const closeOrRedirect = (
  fallbackPage: 'DASHBOARD' | 'LOGIN' = 'DASHBOARD'
): void => {
  try {
    if (window.opener) {
      window.close();
    } else {
      window.location.href = getPageUrl(fallbackPage);
    }
  } catch (error) {
    logger.error(`Failed to close window, redirecting to ${fallbackPage}`, error);
    window.location.href = getPageUrl(fallbackPage);
  }
};
