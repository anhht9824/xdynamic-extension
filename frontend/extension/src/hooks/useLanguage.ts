import { useState, useEffect, useCallback } from "react";
import { logger } from "../utils";
import { Language } from "../types";
import { translations } from "../locales/translations";
import type { Translations } from "../types/i18n";

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>("en");

  const getBrowserLanguage = useCallback((): Language => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("vi")) return "vi";
    return "en";
  }, []);

  const applyLanguageToDocument = useCallback((newLanguage: Language) => {
    document.documentElement.lang = newLanguage;
  }, []);

  const changeLanguage = useCallback(
    (newLanguage: Language) => {
      logger.debug("Changing language to:", newLanguage);
      setLanguage(newLanguage);
      applyLanguageToDocument(newLanguage);
      chrome.storage.local.set({ language: newLanguage }, () => {
        logger.debug("Language saved to storage:", newLanguage);
      });

      try {
        chrome.runtime.sendMessage({
          type: "LANGUAGE_CHANGED",
          payload: newLanguage,
        });
      } catch (error) {
        logger.warn("Failed to broadcast language change", error);
      }
    },
    [applyLanguageToDocument]
  );

  const toggleLanguage = useCallback(() => {
    const newLanguage = language === "en" ? "vi" : "en";
    changeLanguage(newLanguage);
  }, [language, changeLanguage]);

  const t = useCallback(
    (key: keyof Translations | string, fallback?: string): string => {
      const translation =
        (translations as Translations)[key as keyof Translations]?.[language];
      return String(translation || fallback || key);
    },
    [language]
  );

  useEffect(() => {
    chrome.storage.local.get(["language"], (result) => {
      const savedLanguage =
        (result.language as Language) || getBrowserLanguage();
      setLanguage(savedLanguage);
      applyLanguageToDocument(savedLanguage);
    });
  }, [getBrowserLanguage, applyLanguageToDocument]);

  useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName !== "local" || !changes.language) return;
      const nextLanguage =
        (changes.language.newValue as Language) || getBrowserLanguage();
      setLanguage(nextLanguage);
      applyLanguageToDocument(nextLanguage);
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [applyLanguageToDocument, getBrowserLanguage]);

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
