import React from "react";
import { cn } from "../../lib/utils";
import { useLanguageContext } from "../../providers/LanguageProvider";

interface ContentTypeButtonProps {
  label: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isEnabled: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ContentTypeButton: React.FC<ContentTypeButtonProps> = ({
  label,
  IconComponent,
  isActive,
  isEnabled,
  disabled = false,
  onClick,
}) => {
  const { t } = useLanguageContext();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={isActive && isEnabled}
      aria-label={`${label} - ${disabled ? t("common.requireLogin", "Cần đăng nhập") : isActive ? t("common.active", "Bật") : t("common.inactive", "Tắt")}`}
      className={cn(
        "flex flex-col w-[140px] h-[100px] items-center justify-center gap-2 px-3 py-4 rounded-2xl shadow-lg transition-all duration-300 border-2",
        disabled
          ? "bg-gray-200 border-gray-300 hover:bg-gray-250 cursor-not-allowed opacity-60"
          : isActive && isEnabled
          ? "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-400 hover:from-teal-100 hover:to-teal-200"
          : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
      )}
    >
      <IconComponent
        className={cn(
          "transition-all duration-200",
          label.includes("Ảnh") || label.includes("Image") ? "w-[62.38px] h-12" : "w-12 h-12"
        )}
      />
      <span
        className={cn(
          "font-['Sora',Helvetica] text-sm text-center tracking-[-0.01em] leading-tight whitespace-nowrap",
          disabled
            ? "text-gray-500 font-medium"
            : isActive && isEnabled
            ? "text-teal-700 font-bold"
            : "text-gray-700 font-semibold"
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default ContentTypeButton;
