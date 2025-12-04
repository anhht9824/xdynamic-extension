import React from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeContext } from "../../providers/ThemeProvider";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { GlassButton } from "../ui/GlassButton";
import { cn } from "../../lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "button" | "cycle" | "dropdown";
  size?: "sm" | "default" | "lg";
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = "button",
  size = "default",
}) => {
  const { theme, resolvedTheme, toggleTheme, changeTheme } = useThemeContext();
  const { t } = useLanguageContext();

  const getThemeIcon = () => {
    return resolvedTheme === "light" ? (
      <Sun className="h-4 w-4" />
    ) : (
      <Moon className="h-4 w-4" />
    );
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return t("theme.light", "Light");
      case "dark":
        return t("theme.dark", "Dark");
      default:
        return t("theme.light", "Light");
    }
  };

  if (variant === "dropdown") {
    return (
      <div className={cn("relative", className)}>
        <select
          value={theme}
          onChange={(e) => changeTheme(e.target.value as any)}
          className="glass-medium rounded-glass px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={t("settings.theme", "Theme")}
        >
          <option value="light">{t("theme.light", "Light")}</option>
          <option value="dark">{t("theme.dark", "Dark")}</option>
        </select>
      </div>
    );
  }

  if (variant === "cycle") {
    const cycleTheme = () => {
      const themes = ["light", "dark"] as const;
      const currentTheme = theme === "system" ? "light" : theme;
      const currentIndex = themes.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      changeTheme(themes[nextIndex]);
    };

    return (
      <GlassButton
        variant="ghost"
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
        onClick={cycleTheme}
        className={cn("gap-2", className)}
        title={getThemeLabel()}
        aria-label={t("settings.theme", "Theme")}
      >
        {getThemeIcon()}
        <span className="text-xs font-medium">{getThemeLabel()}</span>
      </GlassButton>
    );
  }

  return (
    <GlassButton
      variant="ghost"
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
      onClick={toggleTheme}
      className={cn("", className)}
      title={
        resolvedTheme === "light"
          ? t("theme.dark", "Dark")
          : t("theme.light", "Light")
      }
      aria-label={t("settings.theme", "Theme")}
    >
      {getThemeIcon()}
    </GlassButton>
  );
};
