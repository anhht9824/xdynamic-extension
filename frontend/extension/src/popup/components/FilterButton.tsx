import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { useLanguageContext } from "../../providers/LanguageProvider";

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  isEnabled: boolean;
  disabled?: boolean;
  onClick: () => void;
  multiLine?: boolean;
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

  const statusText = disabled ? "" : isActive && isEnabled ? "Bật" : "Tắt";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);

    const button = e.currentTarget;
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
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
      aria-label={`${label} - ${
        disabled ? t("common.premium", "Premium") : isActive ? t("common.active", "Bật") : t("common.inactive", "Tắt")
      }`}
      role="switch"
      tabIndex={disabled ? -1 : 0}
      className={cn(
        "min-w-[100px] min-h-[48px] h-12 w-full",
        "rounded-2xl border-2 border-solid shadow-sm",
        "transition-all duration-300 ease-in-out",
        "flex items-center justify-between",
        "relative overflow-hidden",
        "px-0 py-0",
        disabled
          ? "bg-gray-200 border-gray-300 cursor-not-allowed opacity-80"
          : "cursor-pointer active:scale-95",
        !disabled && !(isActive && isEnabled) &&
          "bg-gray-100 border-gray-300 hover:bg-gray-200",
        !disabled && (isActive && isEnabled) &&
          "bg-emerald-50 border-emerald-400 hover:bg-emerald-100"
      )}
    >
      {isPressed && !disabled && (
        <span className="absolute inset-0 bg-white/30 animate-ripple pointer-events-none" />
      )}

      <div className="flex items-center w-full h-full">
        <div className={cn(
          "flex-1 flex items-center justify-center h-full px-2",
          !disabled && (isActive && isEnabled) ? "text-emerald-700" : "text-gray-600"
        )}>
          <span className="font-['Sora',Helvetica] font-medium text-sm text-center tracking-[-0.01em] leading-tight break-words">
            {label}
          </span>
        </div>
        
        <div className={cn(
          "w-[1px] h-full",
          !disabled && (isActive && isEnabled) ? "bg-emerald-200" : "bg-gray-300"
        )} />

        <div className={cn(
          "w-[40px] flex items-center justify-center h-full px-1",
          !disabled && (isActive && isEnabled) ? "text-emerald-600" : "text-gray-500"
        )}>
          <span className="font-['Sora',Helvetica] font-medium text-xs text-center tracking-[-0.01em] leading-tight whitespace-nowrap">
            {statusText}
          </span>
        </div>
      </div>
    </button>
  );
};

export default FilterButton;
