import React from "react";
import { Button } from "../../components/ui";
import { safeCloseWindow } from "../../utils";

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip: () => void;
  onLogin?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onSkip, onLogin }) => {
  const handleSkip = () => {
    onSkip();
    // Safe close with fallback to dashboard
    safeCloseWindow();
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          Bỏ qua
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 max-w-md mx-auto">
        {/* Image placeholder - you can replace with actual image */}
        <div className="w-64 h-40 bg-blue-100 rounded-lg mb-8 flex items-center justify-center">
          <div className="text-blue-500 text-sm">Family Image</div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Chào mừng đến với XDynamic
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center text-base leading-relaxed mb-10 px-4">
          XDynamic – Giải pháp bảo vệ bạn và gia đình khỏi nội dung độc hại trên Internet.
          <br />
          Khởi đầu hành trình an toàn ngay hôm nay, hoặc chọn bỏ qua để khám phá sau.
        </p>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <Button
            onClick={onStart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base"
            size="lg"
          >
            Bắt đầu ngay
          </Button>
          
          {/* Login link for existing users */}
          {onLogin && (
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <button
                  onClick={onLogin}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Đăng nhập
                </button>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;