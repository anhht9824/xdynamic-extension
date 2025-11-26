import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGlass } from '../../hooks/useGlass';
import { GlassButton } from './GlassButton';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const toastVariants = {
  success: 'light' as const,
  error: 'heavy' as const,
  warning: 'medium' as const,
  info: 'light' as const
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const { getGlassStyle } = useGlass();
  const [isVisible, setIsVisible] = useState(false);
  const Icon = toastIcons[type];

  useEffect(() => {
    setIsVisible(true);
    
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={cn(
        getGlassStyle(toastVariants[type]),
        'rounded-lg shadow-lg p-4 transition-all duration-300 transform',
        'max-w-sm w-full',
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {message}
            </p>
          )}
        </div>

        <GlassButton
          variant="secondary"
          size="sm"
          onClick={() => onClose(id)}
          className="p-1 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </GlassButton>
      </div>
    </div>
  );
};