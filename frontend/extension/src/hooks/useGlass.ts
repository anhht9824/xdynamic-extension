import { useThemeContext } from "../providers/ThemeProvider";

export const useGlass = () => {
  const { resolvedTheme } = useThemeContext();

  const getGlassStyle = (
    variant: "light" | "medium" | "heavy" = "medium"
  ): string => {
    const baseClasses =
      "backdrop-blur-glass border border-glass-light dark:border-glass-dark";

    switch (variant) {
      case "light":
        return `${baseClasses} bg-glass-light shadow-glass-light`;
      case "heavy":
        return `${baseClasses} bg-glass-medium shadow-glass-heavy`;
      default:
        return `${baseClasses} bg-glass-medium shadow-glass-medium`;
    }
  };

  const glassClasses = {
    light: getGlassStyle("light"),
    medium: getGlassStyle("medium"),
    heavy: getGlassStyle("heavy"),
  };

  return { getGlassStyle, glassClasses, theme: resolvedTheme };
};
