import React from "react";
import { cn } from "../../lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "medium" | "heavy";
  hover?: boolean;
  children: React.ReactNode;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    { className, variant = "medium", hover = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-glass p-4",
          {
            "glass-light": variant === "light",
            "glass-medium": variant === "medium",
            "glass-heavy": variant === "heavy",
            "glass-hover cursor-pointer": hover,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
