export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface GlassVariant {
  light: string;
  dark: string;
}

export const glassStyles: Record<string, GlassVariant> = {
  primary: {
    light: "bg-white/20 backdrop-blur-md border border-white/30",
    dark: "bg-gray-900/20 backdrop-blur-md border border-gray-700/30",
  },
  secondary: {
    light: "bg-white/10 backdrop-blur-sm border border-white/20",
    dark: "bg-gray-800/10 backdrop-blur-sm border border-gray-600/20",
  },
  accent: {
    light: "bg-blue-500/20 backdrop-blur-md border border-blue-400/30",
    dark: "bg-blue-600/20 backdrop-blur-md border border-blue-500/30",
  },
  success: {
    light: "bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30",
    dark: "bg-emerald-600/20 backdrop-blur-md border border-emerald-500/30",
  },
  warning: {
    light: "bg-amber-500/20 backdrop-blur-md border border-amber-400/30",
    dark: "bg-amber-600/20 backdrop-blur-md border border-amber-500/30",
  },
  danger: {
    light: "bg-red-500/20 backdrop-blur-md border border-red-400/30",
    dark: "bg-red-600/20 backdrop-blur-md border border-red-500/30",
  },
};
