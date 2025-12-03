import React from "react";
import { Check, X } from "lucide-react";
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
    track: "h-8 w-[82px] px-1.5",
    knob: "h-6 w-6",
    icon: "h-3.5 w-3.5",
    gap: "gap-2.5",
  },
  lg: {
    track: "h-9 w-[94px] px-2",
    knob: "h-7 w-7",
    icon: "h-4 w-4",
    gap: "gap-3",
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
      "focus:outline-none rounded-full",
      disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
    )}
  >
      <span
        className={clsx(
          "flex items-center rounded-full transition-all duration-200",
          checked
            ? "justify-end bg-gradient-to-r from-blue-500 to-blue-600 shadow-[0_4px_12px_rgba(59,130,246,0.25)]"
            : "justify-start bg-slate-200",
          sizes.track
        )}
      >
        <span
          className={clsx(
            "bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-200",
            sizes.knob,
            checked ? "translate-x-0.5" : "-translate-x-0.5"
          )}
        >
          {checked ? (
            <Check className={clsx("text-blue-600", sizes.icon)} strokeWidth={3} />
          ) : (
            <X className={clsx("text-slate-400", sizes.icon)} strokeWidth={3} />
          )}
        </span>
      </span>
      <span
        className={clsx(
          "text-xs font-semibold tracking-wide uppercase",
          checked ? "text-blue-600" : "text-slate-600"
        )}
      >
        {checked ? labelOn : labelOff}
      </span>
    </button>
  );
};

export default SettingToggle;
