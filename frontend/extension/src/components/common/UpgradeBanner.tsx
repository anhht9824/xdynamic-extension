import React from "react";
import { Button } from "../ui";

interface UpgradeBannerProps {
  title?: string;
  message?: string;
  features?: string[];
  onUpgrade: () => void;
  onDismiss?: () => void;
  variant?: "compact" | "full";
}

/**
 * Upgrade banner to encourage guest users to sign up
 * 
 * @example
 * ```tsx
 * <UpgradeBanner
 *   title="Nâng cấp lên Premium"
 *   message="Truy cập đầy đủ tính năng"
 *   features={["Bảo vệ không giới hạn", "Báo cáo chi tiết", "Hỗ trợ ưu tiên"]}
 *   onUpgrade={() => redirectToPage('LOGIN')}
 * />
 * ```
 */
const UpgradeBanner: React.FC<UpgradeBannerProps> = ({
  title = "Nâng cấp tài khoản",
  message = "Đăng nhập để truy cập đầy đủ tính năng",
  features = [],
  onUpgrade,
  onDismiss,
  variant = "compact",
}) => {
  if (variant === "compact") {
    return (
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 shadow-lg">
        {/* Dismiss button (optional) */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            aria-label="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-white/90">{message}</p>
          </div>
          
          <Button
            onClick={onUpgrade}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold shrink-0"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  // Full variant with features list
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-2xl overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl" />
      
      <div className="relative z-10">
        {/* Dismiss button (optional) */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-0 right-0 text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            aria-label="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Crown icon */}
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-white/90 mb-6">{message}</p>

        {/* Features list */}
        {features.length > 0 && (
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <Button
          onClick={onUpgrade}
          className="w-full bg-white text-purple-600 hover:bg-gray-100 font-semibold text-base py-3"
        >
          Đăng nhập ngay
        </Button>
      </div>
    </div>
  );
};

export default UpgradeBanner;
