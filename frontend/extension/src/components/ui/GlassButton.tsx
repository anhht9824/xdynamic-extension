import React from "react";
import { cn } from "../../lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-glass text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "glass-medium text-foreground hover:scale-105",
        primary:
          "glass-medium bg-primary/20 text-primary-foreground hover:bg-primary/30 hover:scale-105",
        secondary:
          "glass-light text-secondary-foreground hover:bg-secondary/20 hover:scale-105",
        destructive:
          "glass-medium bg-destructive/20 text-destructive-foreground hover:bg-destructive/30 hover:scale-105",
        outline:
          "border border-glass-light bg-transparent hover:glass-light hover:scale-105",
        ghost: "hover:glass-light hover:text-accent-foreground hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-glass-sm px-3",
        lg: "h-11 rounded-glass-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
