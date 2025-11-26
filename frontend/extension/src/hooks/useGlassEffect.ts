import { useEffect, useRef, useState } from "react";

interface GlassEffectOptions {
  variant?: "light" | "medium" | "heavy";
  hover?: boolean;
  animated?: boolean;
  disabled?: boolean;
}

export const useGlassEffect = (options: GlassEffectOptions = {}) => {
  const {
    variant = "medium",
    hover = false,
    animated = true,
    disabled = false,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Generate glass classes based on variant and state
  const getGlassClasses = () => {
    if (disabled) return "";

    const baseClasses = [
      "backdrop-blur-glass",
      "border",
      "border-glass-light",
      "dark:border-glass-dark",
    ];

    // Variant classes
    switch (variant) {
      case "light":
        baseClasses.push("bg-glass-light");
        break;
      case "heavy":
        baseClasses.push("bg-glass-medium", "shadow-glass-heavy");
        break;
      default:
        baseClasses.push("bg-glass-medium", "shadow-glass-medium");
    }

    // Hover classes
    if (hover) {
      baseClasses.push("transition-all", "duration-200", "ease-in-out");
      if (isHovered) {
        baseClasses.push("scale-102", "shadow-glass-heavy");
      }
    }

    // Animation classes
    if (animated && isVisible) {
      baseClasses.push("animate-glass-in");
    }

    return baseClasses.join(" ");
  };

  // Handle hover events
  useEffect(() => {
    const element = ref.current;
    if (!element || !hover) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hover]);

  // Handle intersection observer for animations
  useEffect(() => {
    const element = ref.current;
    if (!element || !animated) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [animated]);

  // Apply glass effect styles
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const classes = getGlassClasses();
    element.className = `${element.className
      .replace(/glass-\S+/g, "")
      .trim()} ${classes}`.trim();
  }, [variant, hover, isHovered, animated, isVisible, disabled]);

  return {
    ref,
    isHovered,
    isVisible,
    glassClasses: getGlassClasses(),

    // Utility methods
    enable: () => (options.disabled = false),
    disable: () => (options.disabled = true),
    setVariant: (newVariant: "light" | "medium" | "heavy") => {
      options.variant = newVariant;
    },
  };
};
