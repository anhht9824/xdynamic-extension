import { useCallback, useEffect, useState } from "react";
import { Theme } from "../types";

const STORAGE_KEY = "theme";
const LOCAL_STORAGE_KEY = "xdynamic-theme";

const isThemeValue = (value: unknown): value is Theme =>
  value === "light" || value === "dark" || value === "system";

const getSystemTheme = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const resolveThemeValue = (theme: Theme): "light" | "dark" =>
  theme === "system" ? getSystemTheme() : theme;

const getCachedTheme = (): Theme | null => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (isThemeValue(cached)) {
      return cached;
    }
  } catch {
    // ignore localStorage errors (private/incognito or disabled)
  }
  return null;
};

const normalizeTheme = (value: Theme): Theme => {
  if (value === "system") {
    return getSystemTheme();
  }
  return value;
};

const initialTheme = normalizeTheme(getCachedTheme() ?? "system");
const initialResolvedTheme = resolveThemeValue(initialTheme);

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [resolvedTheme, setResolvedTheme] =
    useState<"light" | "dark">(initialResolvedTheme);

  // Apply theme to the document and persist selection
  const applyTheme = useCallback(
    (nextResolved: "light" | "dark", rawTheme: Theme) => {
      const isPopup = typeof document !== "undefined" && document.body?.classList.contains("popup");
      const storedTheme = normalizeTheme(rawTheme);
      const resolvedForDom = isPopup ? "light" : nextResolved;

      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resolvedForDom);
      root.dataset.theme = storedTheme;
      root.dataset.themeResolved = resolvedForDom;
      root.style.colorScheme = resolvedForDom;

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, storedTheme);
      } catch {
        // ignore localStorage errors
      }

      try {
        chrome.storage.local.set({ [STORAGE_KEY]: storedTheme });
      } catch {
        // chrome.storage is not available in some environments (tests)
      }
    },
    []
  );

  // Change theme
  const changeTheme = useCallback(
    (newTheme: Theme) => {
      const normalizedTheme = normalizeTheme(newTheme);
      setTheme(normalizedTheme);
      const resolved = resolveThemeValue(normalizedTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved, normalizedTheme);
    },
    [applyTheme]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const nextTheme = resolvedTheme === "light" ? "dark" : "light";
    changeTheme(nextTheme);
  }, [resolvedTheme, changeTheme]);

  // Initialize theme from chrome storage (keeps popup/dashboard in sync)
  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.storage?.local) {
      return;
    }

    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const savedTheme = (result[STORAGE_KEY] as Theme) ?? initialTheme;
      if (!isThemeValue(savedTheme)) return;
      const normalized = normalizeTheme(savedTheme);
      setTheme(normalized);
      const resolved = resolveThemeValue(normalized);
      setResolvedTheme(resolved);
      applyTheme(resolved, normalized);
    });
  }, [applyTheme]);

  // Listen for system theme changes when matching system
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        applyTheme(resolved, theme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  return {
    theme,
    resolvedTheme,
    changeTheme,
    toggleTheme,
    isLight: resolvedTheme === "light",
    isDark: resolvedTheme === "dark",
    isSystem: false,
  };
};
