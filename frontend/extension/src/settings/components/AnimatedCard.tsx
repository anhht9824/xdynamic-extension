import React, { useState, useEffect } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

/**
 * AnimatedCard - Card component with entrance animations and hover effects
 * 
 * Features:
 * - Fade-in + slide-up entrance animation
 * - Configurable delay for staggered animations
 * - Optional hover scale effect
 * - Smooth transitions for all states
 * 
 * @example
 * <AnimatedCard delay={100} hover>
 *   <p>Card content</p>
 * </AnimatedCard>
 */
const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  className = '',
  hover = true,
  onClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      onClick={onClick}
      className={`
        transform transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${hover ? 'hover:scale-[1.02] hover:shadow-xl' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        transitionDelay: isVisible ? '0ms' : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
