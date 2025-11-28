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
  const isOn = isActive && isEnabled;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={isOn}
      aria-label={`${label} - ${
        disabled ? t("common.requireLogin", "Cần đăng nhập") : isOn ? t("common.active", "Bật") : t("common.inactive", "Tắt")
      }`}
      className={cn(
        "flex flex-col w-[140px] h-[100px] items-center justify-center gap-2 px-3 py-4 rounded-3xl shadow-sm transition-all duration-300 border-2",
        disabled
          ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
          : isOn
          ? "bg-emerald-50 border-emerald-400"
          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
      )}
    >
      <IconComponent
        className={cn(
          "transition-all duration-200",
          label.toLowerCase().includes("ảnh") || label.includes("Image")
            ? "w-[62px] h-12"
            : "w-12 h-12"
        )}
      />
      <span
        className={cn(
          "font-['Sora',Helvetica] text-lg font-medium text-center tracking-[-0.01em] leading-tight whitespace-nowrap",
          disabled
            ? "text-gray-400"
            : isOn
            ? "text-emerald-800"
            : "text-gray-600"
        )}
      >
        {label}
      </span>
    </button>
  );
};

export default ContentTypeButton;
