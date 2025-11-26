import React, { useState, useEffect } from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  duration?: number;
}

/**
 * ProgressRing - Circular progress indicator with smooth animation
 * 
 * Features:
 * - Animated progress transition
 * - Customizable colors and size
 * - Optional center label
 * - Gradient support
 * - Responsive design
 * 
 * @example
 * <ProgressRing percentage={75} showLabel label="75%" />
 */
const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  showLabel = true,
  label,
  animated = true,
  duration = 1000,
}) => {
  const [currentPercentage, setCurrentPercentage] = useState(animated ? 0 : percentage);

  useEffect(() => {
    if (!animated) {
      setCurrentPercentage(percentage);
      return;
    }

    const startTime = Date.now();
    const startValue = currentPercentage;
    const endValue = percentage;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = startValue + (endValue - startValue) * eased;

      setCurrentPercentage(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage, animated, duration]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (currentPercentage / 100) * circumference;

  // Color based on percentage
  const getColor = () => {
    if (percentage >= 80) return '#ef4444'; // red
    if (percentage >= 60) return '#f59e0b'; // orange
    if (percentage >= 40) return '#eab308'; // yellow
    return '#10b981'; // green
  };

  const progressColor = color === '#3b82f6' ? getColor() : color;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))',
          }}
        />
      </svg>

      {/* Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            {label || `${Math.round(currentPercentage)}%`}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
