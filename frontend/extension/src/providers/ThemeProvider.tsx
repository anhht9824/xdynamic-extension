import React, { createContext, useContext, ReactNode } from "react";
import { useTheme } from "../hooks/useTheme";
import { Theme } from "../types";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  changeTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLight: boolean;
  isDark: boolean;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeHook = useTheme();

  return (
    <ThemeContext.Provider value={themeHook}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
