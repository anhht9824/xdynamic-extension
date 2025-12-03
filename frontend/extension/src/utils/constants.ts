/**
 * Application-wide constants
 * Centralized location for magic numbers and repeated strings
 */

export { EXTENSION_PAGES } from "../core/config/pages";
export { STORAGE_KEYS } from "../core/config/storageKeys";

// External apps/links
export const EXTERNAL_LINKS = {
  ADMIN_DASHBOARD: import.meta.env.VITE_ADMIN_DASHBOARD_URL || "http://localhost:5173",
} as const;

// Timing constants
export const TIMING = {
  DEBOUNCE_DELAY: 300,
  AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 200,
} as const;

// Plan types
export const PLAN_TYPES = {
  FREE: 'free',
  PLUS: 'plus',
  PRO: 'pro',
  PREMIUM_PLUS: 'premium_plus',
} as const;

// Default values
export const DEFAULTS = {
  SPEED_LIMIT: 80,
  USAGE_LIMIT_GB: 10,
  BLOCKED_TODAY: 0,
  BLOCKED_COUNT: 681,
  PROTECTION_ENABLED: true,
  AUTO_UPDATE_ENABLED: true,
} as const;

// API configuration
export const API = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// UI configuration
export const UI = {
  MAX_MOBILE_WIDTH: 768,
  MAX_TABLET_WIDTH: 1024,
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
} as const;

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_SETTINGS_TYPES: ['application/json', 'text/csv'],
} as const;

// Validation patterns
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  PASSWORD_MIN_LENGTH: 8,
  URL_PATTERN_REGEX: /^[\w*.-]+$/,
} as const;
