import React, { useCallback } from "react";
import { cn } from "../../lib/utils";
import { useExtensionContext } from "../../providers/ExtensionProvider";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useSiteDetection } from "../../hooks/useSiteDetection";
import { useDebouncedCallback } from "../../hooks";

interface ToggleBarProps {
  isDisabled?: boolean;
}

const ToggleBar: React.FC<ToggleBarProps> = ({ isDisabled = false }) => {
  const { isEnabled, toggleExtension } = useExtensionContext();
  const { t } = useLanguageContext();
  const { siteInfo } = useSiteDetection({ isEnabled });

  const debouncedToggle = useDebouncedCallback(() => {
    if (!isDisabled) {
      toggleExtension();
    }
  }, 200);

  const handleToggle = useCallback(() => {
    debouncedToggle();
  }, [debouncedToggle]);

  const getStatusColor = () => {
    if (!isEnabled) return "gray";
    switch (siteInfo.status) {
      case "blocked": return "red";
      case "protected": return "green";
      default: return "yellow";
    }
  };

  const statusColor = getStatusColor();

  const colorClasses = {
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-500",
      iconBg: "bg-gray-400",
      iconText: "text-white",
      moreBtn: "text-gray-400"
    },
    green: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      iconBg: "bg-emerald-500",
      iconText: "text-white",
      moreBtn: "text-emerald-600"
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      iconBg: "bg-red-500",
      iconText: "text-white",
      moreBtn: "text-red-600"
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      iconBg: "bg-yellow-500",
      iconText: "text-white",
      moreBtn: "text-yellow-600"
    }
  };

  const currentColors = colorClasses[statusColor as keyof typeof colorClasses];

  return (
    <div className="flex items-center gap-2 w-full">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isDisabled}
        className={cn(
          "relative w-[72px] h-[32px] rounded-full transition-all duration-300 flex items-center px-1",
          isDisabled
            ? "bg-gray-200 cursor-not-allowed"
            : isEnabled
            ? "bg-emerald-100"
            : "bg-red-100"
        )}
        aria-pressed={isEnabled}
        aria-label={isEnabled ? t("common.active", "Bật") : t("common.inactive", "Tắt")}
      >
        <span
          className={cn(
            "absolute left-2 text-[11px] font-bold z-10 transition-opacity duration-300",
            isEnabled ? "text-emerald-600 opacity-100" : "opacity-0"
          )}
        >
          {t("common.active", "Bật")}
        </span>
        <span
          className={cn(
            "absolute right-2 text-[11px] font-bold z-10 transition-opacity duration-300",
            !isEnabled ? "text-red-600 opacity-100" : "opacity-0"
          )}
        >
          {t("common.inactive", "Tắt")}
        </span>
        <span
          className={cn(
            "absolute w-6 h-6 rounded-full shadow-sm transition-all duration-300 z-20 flex items-center justify-center",
            isEnabled 
              ? "translate-x-[38px] bg-emerald-500" 
              : "translate-x-0 bg-red-500"
          )}
        />
      </button>

      <div className={cn(
        "flex items-center gap-2 flex-1 h-[32px] rounded-full px-1 transition-colors duration-300 border min-w-0",
        currentColors.bg,
        currentColors.border
      )}>
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
            currentColors.iconBg
          )}
        >
          <svg className={cn("w-3.5 h-3.5", currentColors.iconText)} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            {siteInfo.status === "blocked" ? (
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" stroke="none"/>
            ) : siteInfo.status === "protected" ? (
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" stroke="none"/>
            ) : (
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" stroke="none"/>
            )}
             {siteInfo.status === "blocked" ? (
               <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             ) : siteInfo.status === "protected" ? (
               <path d="M17 9L10 16L7 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             ) : (
               <path d="M12 8V12M12 16H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             )}
          </svg>
        </div>
        
        <div className={cn(
          "flex-1 text-center font-['Sora',Helvetica] font-medium text-sm truncate min-w-0",
          currentColors.text
        )}>
          {siteInfo.hostname || "google.com"}
        </div>

        <button
          type="button"
          className={cn(
            "w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors shrink-0",
            currentColors.moreBtn
          )}
          aria-label={t("common.more", "Tùy chọn")}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToggleBar;
