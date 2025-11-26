import { useState, useEffect, useCallback } from "react";
import { logger } from "../utils";
import { Language } from "../types";

// Translation keys and values
type TranslationKey = string;
type TranslationValue = string;
type Translations = Record<TranslationKey, TranslationValue>;

// Translation data
const translations: Record<Language, Translations> = {
  en: {
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.active": "Active",
    "common.inactive": "Inactive",
    "common.profile": "Profile",

    // Extension
    "extension.title": "XDynamic Extension",
    "extension.enabled": "Extension Enabled",
    "extension.disabled": "Extension Disabled",
    "extension.toggle": "Toggle Extension",

    // Settings
    "settings.title": "Settings",
    "settings.general": "General",
    "settings.filters": "Filters",
    "settings.notifications": "Notifications",
    "settings.privacy": "Privacy",
    "settings.theme": "Theme",
    "settings.language": "Language",

    // Themes
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    // Languages
    "language.en": "English",
    "language.vi": "Tiếng Việt",
    "language.current": "English",

    // Stats
    "stats.blocked": "Blocked {count} harmful items",
    "stats.items": "items",

    // Report
    "report.button": "Report",

    // Status
    "status.protected": "Protected",
    "status.unknown": "Unknown", 
    "status.blocked": "Blocked",

    // Filters
    "filter.level": "Filter Level",
    "filter.strict": "Strict",
    "filter.moderate": "Moderate",
    "filter.permissive": "Permissive",
    "filter.sensitive": "Sensitive",
    "filter.violence": "Violence",
    "filter.toxicity": "Toxic",
    "filter.vice": "Stimulants",

    // Content Types
    "content.image": "Image",
    "content.video": "Video",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signOut": "Sign Out",
    "auth.username": "Username",
    "auth.password": "Password",

    // Guest Mode
    "guest.welcome": "Welcome to XDynamic",
    "guest.continueAsGuest": "Continue as Guest",
    "guest.settingsDisabled": "Available for members only",
    "guest.limitedFeatures": "Guest mode has limited features",

    // Info/Help
    "info.help": "Help & Onboarding",
    "info.tutorial": "View Tutorial",
    "info.features": "Learn More",
  },
  vi: {
    // Common
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.delete": "Xóa",
    "common.edit": "Chỉnh sửa",
    "common.close": "Đóng",
    "common.loading": "Đang tải...",
    "common.error": "Lỗi",
    "common.success": "Thành công",
    "common.active": "Bật",
    "common.inactive": "Tắt",
    "common.profile": "Hồ sơ",

    // Extension
    "extension.title": "Tiện ích XDynamic",
    "extension.enabled": "Tiện ích đã bật",
    "extension.disabled": "Tiện ích đã tắt",
    "extension.toggle": "Bật/tắt tiện ích",

    // Settings
    "settings.title": "Cài đặt",
    "settings.general": "Tổng quan",
    "settings.filters": "Bộ lọc",
    "settings.notifications": "Thông báo",
    "settings.privacy": "Riêng tư",
    "settings.theme": "Giao diện",
    "settings.language": "Ngôn ngữ",

    // Themes
    "theme.light": "Sáng",
    "theme.dark": "Tối",
    "theme.system": "Hệ thống",

    // Languages
    "language.en": "English",
    "language.vi": "Tiếng Việt",
    "language.current": "Tiếng Việt",

    // Stats
    "stats.blocked": "Đã chặn được {count} phương tiện độc hại",
    "stats.items": "mục",

    // Report
    "report.button": "Báo cáo",

    // Status
    "status.protected": "Được bảo vệ",
    "status.unknown": "Chưa xác định",
    "status.blocked": "Đã chặn",

    // Filters
    "filter.level": "Mức độ lọc",
    "filter.strict": "Nghiêm ngặt",
    "filter.moderate": "Vừa phải",
    "filter.permissive": "Thoải mái",
    "filter.sensitive": "Nhạy cảm",
    "filter.violence": "Bạo lực",
    "filter.toxicity": "Tiêu cực",
    "filter.vice": "Chất kích thích",

    // Content Types
    "content.image": "Hình ảnh",
    "content.video": "Video",

    // Auth
    "auth.signIn": "Đăng nhập",
    "auth.signOut": "Đăng xuất",
    "auth.username": "Tên đăng nhập",
    "auth.password": "Mật khẩu",

    // Guest Mode
    "guest.welcome": "Chào mừng đến XDynamic",
    "guest.continueAsGuest": "Tiếp tục với chế độ khách",
    "guest.settingsDisabled": "Chỉ dành cho thành viên",
    "guest.limitedFeatures": "Chế độ khách có tính năng giới hạn",

    // Info/Help
    "info.help": "Trợ giúp & Hướng dẫn",
    "info.tutorial": "Xem hướng dẫn",
    "info.features": "Tìm hiểu thêm",
  },
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>("en");

  // Get browser language
  const getBrowserLanguage = useCallback((): Language => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("vi")) return "vi";
    return "en";
  }, []);

  // Change language
  const changeLanguage = useCallback((newLanguage: Language) => {
    logger.debug('Changing language to:', newLanguage);
    setLanguage(newLanguage);
    chrome.storage.local.set({ language: newLanguage }, () => {
      logger.debug('Language saved to storage:', newLanguage);
    });
  }, []);

  // Toggle language
  const toggleLanguage = useCallback(() => {
    const newLanguage = language === "en" ? "vi" : "en";
    changeLanguage(newLanguage);
  }, [language, changeLanguage]);

  // Translate function
  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      const translation = translations[language]?.[key];
      return translation || fallback || key;
    },
    [language]
  );

  // Initialize language from storage
  useEffect(() => {
    chrome.storage.local.get(["language"], (result) => {
      const savedLanguage =
        (result.language as Language) || getBrowserLanguage();
      setLanguage(savedLanguage);
    });
  }, [getBrowserLanguage]);

  return {
    language,
    changeLanguage,
    toggleLanguage,
    t,
    isEnglish: language === "en",
    isVietnamese: language === "vi",
    availableLanguages: [
      { code: "en", name: "English" },
      { code: "vi", name: "Tiếng Việt" },
    ] as const,
  };
};
