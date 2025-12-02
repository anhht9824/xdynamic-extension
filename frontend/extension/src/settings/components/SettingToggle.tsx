import React from "react";
import { Check, Minus, X } from "lucide-react";
import clsx from "clsx";

type ToggleSize = "md" | "lg";

interface SettingToggleProps {
  checked: boolean;
  onChange: (nextValue: boolean) => void;
  disabled?: boolean;
  size?: ToggleSize;
  labelOn?: string;
  labelOff?: string;
  "aria-label"?: string;
}

const sizeConfig: Record<ToggleSize, { track: string; knob: string; icon: string; gap: string }> = {
  md: {
    track: "h-9 w-[88px] px-1.5",
    knob: "h-7 w-7",
    icon: "h-3.5 w-3.5",
    gap: "gap-3",
  },
  lg: {
    track: "h-11 w-[104px] px-2",
    knob: "h-9 w-9",
    icon: "h-4 w-4",
    gap: "gap-4",
  },
};

export const SettingToggle: React.FC<SettingToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  labelOn = "BẬT",
  labelOff = "TẮT",
  "aria-label": ariaLabel,
}) => {
  const sizes = sizeConfig[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={clsx(
        "inline-flex items-center",
        sizes.gap,
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-full",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      )}
    >
      <span
        className={clsx(
          "flex items-center rounded-full transition-colors duration-300",
          checked ? "bg-[#3b82f6] justify-end" : "bg-[#e5e7eb] justify-start",
          sizes.track
        )}
      >
        <span
          className={clsx(
            "bg-white rounded-full shadow-sm flex items-center justify-center transition-all duration-300",
            "text-center",
            sizes.knob,
            checked ? "scale-[1.02]" : "scale-100"
          )}
        >
          {checked ? (
            <Check className={clsx("text-emerald-600", sizes.icon)} strokeWidth={3} />
          ) : (
            <X className={clsx("text-red-500", sizes.icon)} strokeWidth={3} />
          )}
        </span>
      </span>
      <span
        className={clsx(
          "text-xs font-semibold tracking-wide uppercase",
          checked ? "text-green-600" : "text-red-600"
        )}
      >
        {checked ? labelOn : labelOff}
      </span>
    </button>
  );
};

export default SettingToggle;
