import React from "react";
import { cn } from "../../lib/utils";
import { GlassButton } from "./GlassButton";

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

interface GlassNavigationProps {
  items: NavigationItem[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const GlassNavigation: React.FC<GlassNavigationProps> = ({
  items,
  orientation = "horizontal",
  className,
}) => {
  return (
    <nav
      className={cn(
        "glass-medium rounded-glass p-2",
        {
          "flex flex-row space-x-1": orientation === "horizontal",
          "flex flex-col space-y-1": orientation === "vertical",
        },
        className
      )}
    >
      {items.map((item) => (
        <GlassButton
          key={item.id}
          variant={item.active ? "primary" : "ghost"}
          size="sm"
          onClick={item.onClick}
          className={cn("justify-start", {
            "flex-1": orientation === "horizontal",
            "w-full": orientation === "vertical",
          })}
        >
          {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
          {item.label}
        </GlassButton>
      ))}
    </nav>
  );
};

GlassNavigation.displayName = "GlassNavigation";
