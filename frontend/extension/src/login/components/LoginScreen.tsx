import React, { useState } from "react";
import { Button, FormInput } from "../../components/ui";

interface LoginScreenProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  onFacebookLogin: () => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
  isLoading?: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onFacebookLogin,
  onGoogleLogin,
  onForgotPassword,
  onCreateAccount,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(email, password, rememberMe);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng</h2>
          <p className="text-gray-600 text-sm">
            Đăng nhập vào tài khoản của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            error={errors.email}
            required
          />

          {/* Password Field */}
          <div className="relative">
            <FormInput
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              error={errors.password}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 text-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ mật khẩu?
              </label>
            </div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          {/* Social Login Options */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">hoặc tiếp tục với</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onFacebookLogin}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tiếp tục với Facebook
            </button>

            <button
              type="button"
              onClick={onGoogleLogin}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Tiếp tục với số điện thoại
            </button>
          </div>

          {/* Create Account Link */}
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={onCreateAccount}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Đăng ký
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;