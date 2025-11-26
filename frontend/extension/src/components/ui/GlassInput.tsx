import React from "react";
import { cn } from "../../lib/utils";

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "light" | "medium";
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, variant = "medium", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-glass px-3 py-2 text-sm transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          {
            "glass-light": variant === "light",
            "glass-medium": variant === "medium",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassInput.displayName = "GlassInput";

export { GlassInput };
