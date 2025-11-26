import { useState, useEffect, useCallback } from "react";
import { Theme } from "../types";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Get system theme preference
  const getSystemTheme = useCallback((): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Resolve theme based on current setting
  const resolveTheme = useCallback(
    (currentTheme: Theme): "light" | "dark" => {
      if (currentTheme === "system") {
        return getSystemTheme();
      }
      return currentTheme;
    },
    [getSystemTheme]
  );

  // Apply theme to document
  const applyTheme = useCallback(
    (resolvedTheme: "light" | "dark") => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);

      // Store in chrome storage
      chrome.storage.local.set({ theme: theme });
    },
    [theme]
  );

  // Change theme
  const changeTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    },
    [resolveTheme, applyTheme]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    changeTheme(newTheme);
  }, [resolvedTheme, changeTheme]);

  // Initialize theme from storage
  useEffect(() => {
    chrome.storage.local.get(["theme"], (result) => {
      const savedTheme = (result.theme as Theme) || "system";
      setTheme(savedTheme);
      const resolved = resolveTheme(savedTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    });
  }, [resolveTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, getSystemTheme, applyTheme]);

  return {
    theme,
    resolvedTheme,
    changeTheme,
    toggleTheme,
    isLight: resolvedTheme === "light",
    isDark: resolvedTheme === "dark",
    isSystem: theme === "system",
  };
};
