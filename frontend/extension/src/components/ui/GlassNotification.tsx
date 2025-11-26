import React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { cn } from "../../lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

interface GlassNotificationProps {
  type: NotificationType;
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  className?: string;
}

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const notificationStyles = {
  success:
    "border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
  error: "border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
  warning:
    "border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
  info: "border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
};

export const GlassNotification: React.FC<GlassNotificationProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  className,
}) => {
  const Icon = notificationIcons[type];

  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <GlassCard
      variant="medium"
      className={cn(
        "flex items-start gap-3 p-4 animate-slide-in",
        notificationStyles[type],
        className
      )}
    >
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />

      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-medium mb-1">{title}</h4>}
        <p className="text-sm opacity-90">{message}</p>
      </div>

      {onClose && (
        <GlassButton
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </GlassButton>
      )}
    </GlassCard>
  );
};
