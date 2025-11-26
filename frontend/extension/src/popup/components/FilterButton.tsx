import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { useLanguageContext } from "../../providers/LanguageProvider";

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  isEnabled: boolean;
  disabled?: boolean;
  onClick: () => void;
  multiLine?: boolean; // Keep for backwards compatibility but not used
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  isActive,
  isEnabled,
  disabled = false,
  onClick,
}) => {
  const { t } = useLanguageContext();
  const [isPressed, setIsPressed] = useState(false);
  
  // Always show status text for consistent layout, even when disabled
  const statusText = disabled 
    ? "" 
    : (isActive && isEnabled) ? "Bật" : "Tắt";

  // Handle click with ripple effect
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Ripple animation
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);
    
    // Visual haptic feedback (scale animation)
    const button = e.currentTarget;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 100);
    
    onClick();
  };
  
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      aria-pressed={isActive && isEnabled}
      aria-disabled={disabled}
      aria-label={`${label} - ${disabled ? t("common.premium", "Premium") : isActive ? t("common.active", "Bật") : t("common.inactive", "Tắt")}`}
      role="switch"
      tabIndex={disabled ? -1 : 0}
      className={cn(
        // Minimum touch target: 100px width × 48px height
        "min-w-[100px] min-h-[48px] h-12 w-full",
        "rounded-xl border-2 border-solid shadow-lg",
        "transition-all duration-300 ease-in-out",
        "flex items-center justify-center",
        "relative overflow-hidden", // For ripple effect
        "px-2.5 py-2", // Padding for content
        disabled
          ? "bg-gray-200 border-gray-300 cursor-not-allowed opacity-60 grayscale"
          : "cursor-pointer active:scale-95",
        !disabled && !(isActive && isEnabled) &&
          "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-xl",
        !disabled && (isActive && isEnabled) &&
          "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-400 hover:from-teal-100 hover:to-teal-200 hover:shadow-xl"
      )}
    >
      {/* Ripple effect overlay */}
      {isPressed && !disabled && (
        <span className="absolute inset-0 bg-white/30 animate-ripple pointer-events-none" />
      )}
      
      <div className="flex items-center justify-center gap-1 w-full">
        <span
          className={cn(
            "font-['Sora',Helvetica] font-semibold text-sm text-center tracking-[-0.01em] leading-tight break-words flex-1 min-w-0",
            disabled 
              ? "text-gray-400" 
              : !(isActive && isEnabled) 
              ? "text-gray-700" 
              : "text-teal-700"
          )}
        >
          {label}
        </span>
        {statusText && (
          <span
            className={cn(
              "font-['Sora',Helvetica] font-medium text-xs text-center tracking-[-0.01em] leading-tight whitespace-nowrap shrink-0 ml-0.5",
              disabled 
                ? "text-gray-400" 
                : !(isActive && isEnabled) 
                ? "text-gray-500" 
                : "text-teal-600"
            )}
          >
            {statusText}
          </span>
        )}
      </div>
    </button>
  );
};

export default FilterButton;
