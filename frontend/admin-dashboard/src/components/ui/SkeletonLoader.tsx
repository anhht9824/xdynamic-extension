import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'text' 
}) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200',
        {
          'rounded': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-lg': variant === 'rectangular',
        },
        className
      )}
    />
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 6 
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 items-center">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className={clsx(
                'h-4',
                colIndex === 0 ? 'w-8' : 'flex-1'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-10" variant="circular" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
};
