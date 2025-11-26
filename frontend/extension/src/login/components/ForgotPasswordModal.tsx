import React, { useState } from "react";
import { Button } from "../../components/ui";
import { VALIDATION } from "../../utils";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }
    
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setError("");
    onSubmit(email);
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Quên mật khẩu
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ Email
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              placeholder="your.email@example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                "Gửi hướng dẫn"
              )}
            </Button>
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Bạn sẽ nhận được email trong vòng 5-10 phút. Hãy kiểm tra cả thư mục spam nếu không thấy email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
