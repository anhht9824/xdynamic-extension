import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration: number = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const { id, type, message } = toast;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgClass: 'bg-green-50 border-green-200',
      iconClass: 'text-green-600',
      textClass: 'text-green-900',
    },
    error: {
      icon: XCircle,
      bgClass: 'bg-red-50 border-red-200',
      iconClass: 'text-red-600',
      textClass: 'text-red-900',
    },
    warning: {
      icon: AlertCircle,
      bgClass: 'bg-yellow-50 border-yellow-200',
      iconClass: 'text-yellow-600',
      textClass: 'text-yellow-900',
    },
    info: {
      icon: Info,
      bgClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-900',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md animate-slide-in pointer-events-auto ${config.bgClass}`}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconClass}`} />
      <p className={`flex-1 text-sm font-medium ${config.textClass}`}>
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
        aria-label="Đóng thông báo"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
