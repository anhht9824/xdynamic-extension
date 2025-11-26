import React from "react";
import { Settings, Power } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { ThemeToggle } from "../common/ThemeToggle";
import { LanguageToggle } from "../common/LanguageToggle";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useExtensionContext } from "../../providers/ExtensionProvider";
import { cn } from "../../lib/utils";

interface HeaderProps {
  className?: string;
  title?: string;
  showSettings?: boolean;
  showToggle?: boolean;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  title,
  showSettings = true,
  showToggle = true,
  onSettingsClick,
}) => {
  const { t } = useLanguageContext();
  const { isEnabled, toggleExtension } = useExtensionContext();

  return (
    <GlassCard
      variant="medium"
      className={cn("flex items-center justify-between p-4 mb-4", className)}
    >
      {/* Logo and Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-glass bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <span className="text-white font-bold text-sm">X</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {title || t("extension.title", "XDynamic Extension")}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isEnabled
              ? t("extension.enabled", "Extension Enabled")
              : t("extension.disabled", "Extension Disabled")}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        {/* Language Toggle */}
        <LanguageToggle size="sm" />

        {/* Theme Toggle */}
        <ThemeToggle size="sm" />

        {/* Extension Toggle */}
        {showToggle && (
          <GlassButton
            variant={isEnabled ? "primary" : "secondary"}
            size="sm"
            onClick={toggleExtension}
            className="gap-2"
            title={t("extension.toggle", "Toggle Extension")}
          >
            <Power
              className={cn(
                "h-4 w-4 transition-colors",
                isEnabled ? "text-green-500" : "text-red-500"
              )}
            />
            <span className="text-xs">
              {isEnabled ? t("common.on", "ON") : t("common.off", "OFF")}
            </span>
          </GlassButton>
        )}

        {/* Settings Button */}
        {showSettings && (
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            title={t("settings.title", "Settings")}
          >
            <Settings className="h-4 w-4" />
          </GlassButton>
        )}
      </div>
    </GlassCard>
  );
};
