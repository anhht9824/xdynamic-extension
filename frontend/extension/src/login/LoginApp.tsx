import React, { useState } from "react";
import { logger, navigateToPage } from "../utils";
import { useAuth } from "../hooks";
import LoginScreen from "./components/LoginScreen";
import ForgotPasswordModal from "./components/ForgotPasswordModal";

type LoginStep = "login" | "verification";

interface LoginState {
  currentStep: LoginStep;
  email: string;
  password: string;
  rememberMe: boolean;
  needsVerification: boolean;
}

const LoginApp: React.FC = () => {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>({
    currentStep: "login",
    email: "",
    password: "",
    rememberMe: false,
    needsVerification: false,
  });

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll simulate login validation
      // In real app, this would call your auth API
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login validation
      if (email && password.length >= 6) {
        // Check if 2FA is enabled (mock condition)
        const needs2FA = email.includes("2fa") || password.includes("2fa");
        
        if (needs2FA) {
          setLoginState({
            ...loginState,
            currentStep: "verification",
            email,
            password,
            rememberMe,
            needsVerification: true,
          });
        } else {
          // Successful login - create user object and sign in
          const userData = {
            id: "user-" + Date.now(),
            email,
            fullName: "Demo User", // In real app, get from API response
            hasCompletedOnboarding: true,
          };
          
          signIn(userData);
          
          // Store remember me preference
          if (rememberMe) {
            chrome.storage.local.set({ rememberLogin: true });
          }
          
          // Redirect to dashboard
          navigateToPage('DASHBOARD');
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      logger.error("Login failed", error);
      // In real app, show error message to user
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Facebook login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: "fb-user-" + Date.now(),
        email: "user@facebook.com",
        fullName: "Facebook User",
        hasCompletedOnboarding: true,
      };
      
      signIn(userData);
      navigateToPage('DASHBOARD');
    } catch (error) {
      logger.error("Facebook login failed", error);
      alert("Đăng nhập Facebook thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate phone login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: "phone-user-" + Date.now(),
        email: "user@phone.com",
        fullName: "Phone User",
        hasCompletedOnboarding: true,
      };
      
      signIn(userData);
      navigateToPage('DASHBOARD');
    } catch (error) {
      logger.error("Phone login failed", error);
      alert("Đăng nhập bằng số điện thoại thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Open forgot password modal
    setShowForgotPasswordModal(true);
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    setIsSendingReset(true);
    try {
      // Simulate API call to send password reset email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      logger.info("Password reset email sent to:", email);
      
      // Show success message
      alert(`Đã gửi hướng dẫn đặt lại mật khẩu đến ${email}. Vui lòng kiểm tra email của bạn.`);
      
      // Close modal
      setShowForgotPasswordModal(false);
    } catch (error) {
      logger.error("Failed to send password reset email", error);
      alert("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleCreateAccount = () => {
    // Redirect to onboarding flow
    navigateToPage('ONBOARDING');
  };

  const handleVerificationComplete = async () => {
    setIsLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user after successful verification
      const userData = {
        id: "verified-user-" + Date.now(),
        email: loginState.email,
        fullName: "Verified User",
        hasCompletedOnboarding: true,
      };
      
      signIn(userData);
      
      if (loginState.rememberMe) {
        chrome.storage.local.set({ rememberLogin: true });
      }
      
      navigateToPage('DASHBOARD');
    } catch (error) {
      logger.error("Verification failed", error);
      alert("Xác thực thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationBack = () => {
    setLoginState({
      ...loginState,
      currentStep: "login",
    });
  };

  if (loginState.currentStep === "verification") {
    // Reuse verification screen from onboarding
    // For now, we'll create a simple placeholder
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Xác thực</h2>
            <p className="text-gray-600 text-sm mb-6">
              Vui lòng nhập mã xác thực được gửi đến {loginState.email}
            </p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nhập mã xác thực"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={6}
            />
            
            <button
              onClick={handleVerificationComplete}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Xác nhận
            </button>
            
            <button
              onClick={handleVerificationBack}
              className="w-full text-gray-600 hover:text-gray-800 py-2"
            >
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoginScreen
        onLogin={handleLogin}
        onFacebookLogin={handleFacebookLogin}
        onGoogleLogin={handleGoogleLogin}
        onForgotPassword={handleForgotPassword}
        onCreateAccount={handleCreateAccount}
        isLoading={isLoading}
      />
      
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSubmit={handleForgotPasswordSubmit}
        isLoading={isSendingReset}
      />
    </>
  );
};

export default LoginApp;