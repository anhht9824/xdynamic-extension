import React from "react";
import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export type SiteStatus = "protected" | "unknown" | "blocked";

interface StatusIndicatorProps {
  status: SiteStatus;
  isEnabled?: boolean;
  variant?: "icon" | "badge" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const STATUS_CONFIG = {
  protected: {
    icon: Check,
    bgClass: "bg-emerald-500",
    textClass: "text-emerald-500",
    symbol: "✓",
  },
  blocked: {
    icon: X,
    bgClass: "bg-red-500", 
    textClass: "text-red-500",
    symbol: "✗",
  },
  unknown: {
    icon: HelpCircle,
    bgClass: "bg-yellow-500",
    textClass: "text-yellow-500", 
    symbol: "?",
  },
} as const;

const SIZE_CONFIG = {
  sm: { container: "w-4 h-4", icon: "w-3 h-3" },
  md: { container: "w-6 h-6", icon: "w-4 h-4" },
  lg: { container: "w-8 h-8", icon: "w-5 h-5" },
} as const;

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  isEnabled = true,
  variant = "icon",
  size = "md",
  className
}) => {
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZE_CONFIG[size];
  const IconComponent = config.icon;

  // For protected status, only show as protected if extension is enabled
  const effectiveStatus = status === "protected" && !isEnabled ? "unknown" : status;
  const effectiveConfig = STATUS_CONFIG[effectiveStatus];

  if (variant === "badge") {
    return (
      <div
        className={cn(
          "rounded-full border border-white flex items-center justify-center text-white text-xs font-bold",
          sizeConfig.container,
          effectiveConfig.bgClass,
          className
        )}
      >
        {effectiveConfig.symbol}
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("rounded-full flex items-center justify-center", sizeConfig.container, effectiveConfig.bgClass)}>
          <IconComponent className={cn(sizeConfig.icon, "text-white")} />
        </div>
        <span className={cn("text-sm font-medium", effectiveConfig.textClass)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    );
  }

  // Default variant: "icon" 
  return (
    <div className={cn("rounded-full flex items-center justify-center", sizeConfig.container, effectiveConfig.bgClass, className)}>
      <IconComponent className={cn(sizeConfig.icon, "text-white font-bold")} />
    </div>
  );
};

export default StatusIndicator;
