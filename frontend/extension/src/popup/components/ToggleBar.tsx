import React, { useCallback, useMemo } from "react";
import { useExtensionContext } from "../../providers/ExtensionProvider";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { cn } from "../../lib/utils";
import StatusIndicator, { SiteStatus } from "./StatusIndicator";
import { useSiteDetection } from "../../hooks/useSiteDetection";
import { useDebouncedCallback } from "../../hooks";

const STATUS_STYLES = {
  protected: {
    borderClass: "border-emerald-500",
    textClass: "text-emerald-800",
    subtextClass: "text-emerald-600",
    containerClass: "bg-emerald-50/20 shadow-emerald-200/50",
  },
  blocked: {
    borderClass: "border-red-500",
    textClass: "text-red-800",
    subtextClass: "text-red-600",
    containerClass: "bg-red-50/20 shadow-red-200/50",
  },
  unknown: {
    borderClass: "border-yellow-500",
    textClass: "text-yellow-800",
    subtextClass: "text-yellow-600",
    containerClass: "bg-yellow-50/20 shadow-yellow-200/50",
  },
} as const;

interface ToggleBarProps {
  isDisabled?: boolean;
}

const ToggleBar: React.FC<ToggleBarProps> = ({ isDisabled = false }) => {
  const { isEnabled, toggleExtension } = useExtensionContext();
  const { t } = useLanguageContext();
  
  // Use custom hook for site detection
  const { siteInfo, isLoading, error } = useSiteDetection({ isEnabled });

  // Memoized style getters
  const statusConfig = useMemo(() => STATUS_STYLES[siteInfo.status], [siteInfo.status]);
  
  const toggleStyles = useMemo(() => ({
    background: cn(
      "w-12 h-6 rounded-full transition-all duration-200",
      isDisabled ? "bg-gray-300/50 cursor-not-allowed" : "cursor-pointer",
      !isDisabled && (isEnabled ? "bg-green-400" : "bg-gray-300")
    ),
    slider: cn(
      "w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 absolute top-0.5",
      isDisabled 
        ? "translate-x-0.5"
        : isEnabled 
          ? "translate-x-6" 
          : "translate-x-0.5"
    )
  }), [isEnabled, isDisabled]);

  const urlBarStyles = useMemo(() => cn(
    "flex-1 h-12 px-3 py-2 bg-white/60 backdrop-blur-md border-2 rounded-2xl flex items-center justify-between shadow-md",
    statusConfig.borderClass,
    statusConfig.containerClass
  ), [statusConfig]);

  // Event handlers
  const debouncedToggle = useDebouncedCallback(() => {
    toggleExtension();
  }, 300);

  const handleToggleClick = useCallback(() => {
    if (!isDisabled) {
      debouncedToggle();
    }
  }, [debouncedToggle, isDisabled]);

  // Status text
  const getStatusText = useCallback((status: SiteStatus) => {
    const statusTextMap = {
      protected: t("status.protected", "Đang chặn kỹ lưỡng"),
      blocked: t("status.blocked", "Đã chặn"),
      unknown: t("status.unknown", "Chưa xác định")
    };
    return statusTextMap[status];
  }, [t]);

  // Component renderers
  const renderToggleSwitch = () => (
    <div className="relative flex items-center gap-1">
      <div className={cn(
        "relative w-[54px] h-[27px] rounded-[50px] transition-all duration-200",
        isDisabled 
          ? "bg-gray-500/30 cursor-not-allowed" 
          : isEnabled 
            ? "bg-teal-500/30 backdrop-blur-sm border border-teal-400/40" 
            : "bg-gray-500/30 backdrop-blur-sm border border-gray-400/40"
      )} onClick={handleToggleClick}>
        <div className="absolute w-[19px] top-[7px] left-[5px] font-['Sora',Helvetica] font-light text-teal-400 text-[9px] text-center tracking-[0] leading-[normal]">
          Bật
        </div>
        <div className={cn(
          "w-[23px] h-[23px] absolute top-0.5 rounded-[50px] shadow-lg transition-transform duration-200",
          isDisabled 
            ? "bg-gray-400 border border-gray-300/50 left-[29px]"
            : isEnabled 
              ? "bg-teal-400 backdrop-blur-sm border border-teal-300/50 left-[29px]" 
              : "bg-gray-400 backdrop-blur-sm border border-gray-300/50 left-[3px]"
        )} />
      </div>
    </div>
  );



  const renderURLBar = () => (
    <div className="flex w-[228px] h-10 items-center justify-between pl-1.5 pr-3.5 py-[5px] bg-white/70 backdrop-blur-md rounded-3xl border-2 border-solid border-teal-400 shadow-md">
      <div className="relative w-[30px] h-[30px]">
        {isEnabled && (
          <div className="w-full h-full bg-teal-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="relative w-[136px] font-['Sora',Helvetica] font-semibold text-gray-700 text-base text-center tracking-[-0.01em] leading-tight">
        {siteInfo.hostname || "google.com"}
      </div>
      
      <button className="relative w-[6.43px] h-[23.29px] flex items-center justify-center">
        <svg className="w-full h-full text-gray-600" fill="currentColor" viewBox="0 0 8 24">
          <circle cx="4" cy="4" r="2"/>
          <circle cx="4" cy="12" r="2"/>
          <circle cx="4" cy="20" r="2"/>
        </svg>
      </button>
    </div>
  );

  return (
    <>
      <div className="absolute w-[54px] h-[27px] top-1.5 left-1">
        {renderToggleSwitch()}
      </div>
      <div className="absolute w-[228px] h-10 top-0 left-[66px]">
        {renderURLBar()}
      </div>
    </>
  );
};

export default ToggleBar;
