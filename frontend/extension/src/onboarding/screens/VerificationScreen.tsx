import React, { useState } from "react";
import { logger } from "../../utils";
import { Button, FormInput } from "../../components/ui";

interface VerificationScreenProps {
  onNext: () => void;
  onBack: () => void;
  email: string;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onNext, onBack, email }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Vui lòng nhập mã xác thực 6 số");
      return;
    }

    // Simulate verification
    if (verificationCode === "123456") {
      onNext();
    } else {
      setError("Mã xác thực không đúng");
    }
  };

  const handleResendCode = () => {
    // Simulate resend
    setError("");
    logger.info("Resending verification code");
  };

  const handleSocialLogin = (provider: string) => {
    // Placeholder for social login
    logger.info(`Social login initiated with ${provider}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-lg transition-colors"
        >
          ←
        </button>
        <span className="text-sm text-gray-500 font-medium">2/4</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Chào mừng
        </h1>
        <p className="text-gray-600 text-center text-base mb-8">
          Đăng nhập vào tài khoản của bạn
        </p>

        {/* Email Display */}
        <div className="mb-6">
          <label className="block text-base font-medium text-gray-700 mb-3">
            Email
          </label>
          <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-600">
            {email}
          </div>
        </div>

        {/* Verification Code Input */}
        <div className="mb-6">
          <FormInput
            type="text"
            label="Mã xác thực"
            placeholder="Nhập mã xác thực 6 số"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            className="text-center text-lg tracking-widest"
            maxLength={6}
            error={error}
          />
        </div>

        {/* Remember Password */}
        <div className="flex items-center mb-8">
          <input
            type="checkbox"
            id="remember"
            checked={rememberPassword}
            onChange={(e) => setRememberPassword(e.target.checked)}
            className="mr-3 w-4 h-4"
          />
          <label htmlFor="remember" className="text-base text-gray-600">
            Ghi nhớ mật khẩu?
          </label>
        </div>

        {/* Resend Code Link */}
        <div className="text-center mb-8">
          <button
            onClick={handleResendCode}
            className="text-blue-500 text-base hover:underline font-medium"
          >
            Quên mật khẩu?
          </button>
        </div>

        {/* Login Button */}
        <div className="space-y-4 mt-auto">
          <Button
            onClick={handleVerify}
            className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base"
            size="lg"
          >
            Đăng nhập
          </Button>

          {/* Or divider */}
          <div className="text-center text-base text-gray-500 my-6">
            hoặc tiếp tục với
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSocialLogin("facebook")}
              variant="outline"
              className="w-full h-12 text-base"
              size="lg"
            >
              Tiếp tục với Facebook
            </Button>
            <Button
              onClick={() => handleSocialLogin("phone")}
              variant="outline"
              className="w-full h-12 text-base"
              size="lg"
            >
              Tiếp tục với số điện thoại
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Bạn chưa có tài khoản?{" "}
            <span className="text-green-500 cursor-pointer hover:underline font-medium">
              Đăng ký
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;