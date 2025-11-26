import React, { useState, useRef } from "react";
import { useClickOutside } from "../../hooks";

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  disabled?: boolean;
}

/**
 * Tooltip component that shows helpful text on hover
 * 
 * @example
 * ```tsx
 * <Tooltip content="Tính năng này chỉ dành cho người dùng Premium">
 *   <Button disabled>Premium Feature</Button>
 * </Tooltip>
 * ```
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  delay = 200,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useClickOutside(tooltipRef, () => setIsVisible(false));

  const showTooltip = () => {
    if (disabled) return;
    
    setIsHovered(true);
    timeoutRef.current = setTimeout(() => {
      if (isHovered) {
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    setIsHovered(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    const positions = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };
    return positions[position];
  };

  const getArrowClasses = () => {
    const arrows = {
      top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent",
      bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent",
      left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent",
      right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent",
    };
    return arrows[position];
  };

  return (
    <div 
      className="relative inline-block w-full h-full"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      ref={tooltipRef}
    >
      {children}
      
      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg
            whitespace-nowrap pointer-events-none
            animate-in fade-in duration-200
            ${getPositionClasses()}
          `}
          role="tooltip"
          aria-hidden={!isVisible}
        >
          {content}
          
          {/* Arrow */}
          <div
            className={`
              absolute w-0 h-0 border-4
              ${getArrowClasses()}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
