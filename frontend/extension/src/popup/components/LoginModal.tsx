import React, { useState } from "react";
import { FormInput, Button, Modal } from "../../components/ui";
import { logger, STORAGE_KEYS } from "../../utils";
import { useToast } from "../../providers";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email la bat buoc";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Email khong hop le";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Mat khau la bat buoc";
    }
    return "";
  };

  const handleEmailBlur = () => {
    const error = validateEmail(formData.email);
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const handlePasswordBlur = () => {
    const error = validatePassword(formData.password);
    setErrors((prev) => ({ ...prev, password: error }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      showToast("error", "Vui long kiem tra lai thong tin");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const username = response.user.email.split("@")[0];
      const capitalizedUsername =
        username.charAt(0).toUpperCase() + username.slice(1);

      const userData = {
        id: response.user.id,
        email: response.user.email,
        fullName: capitalizedUsername,
      };

      signIn(userData);

      chrome.storage.local.set(
        {
          [STORAGE_KEYS.HAS_COMPLETED_ONBOARDING]: true,
          [STORAGE_KEYS.USER]: userData,
        },
        () => {
          chrome.storage.local.remove([STORAGE_KEYS.GUEST_MODE], () => {
            showToast("success", "Dang nhap thanh cong!");
            onLoginSuccess();
          });
        }
      );
    } catch (error) {
      logger.error("Login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Dang nhap that bai. Vui long thu lai";
      showToast("error", errorMessage);
      setErrors({ password: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      showToast("error", "Vui long nhap email hop le");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      logger.info("Password reset requested for:", resetEmail);
      showToast(
        "success",
        "Link dat lai mat khau da duoc gui den email cua ban"
      );
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      logger.error("Password reset error:", error);
      showToast("error", "Co loi xay ra. Vui long thu lai");
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <Modal
        isOpen={true}
        onClose={() => setShowForgotPassword(false)}
        title="Quen mat khau"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-4">
          Nhap email cua ban de nhan link dat lai mat khau
        </p>

        <FormInput
          type="email"
          placeholder="Email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setShowForgotPassword(false)}
            className="flex-1"
          >
            Huy
          </Button>
          <Button
            onClick={handleForgotPassword}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Dang gui..." : "Gui"}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Dang nhap" size="sm">
      <div className="space-y-4">
        <FormInput
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
          onBlur={handleEmailBlur}
          error={errors.email}
        />

        <FormInput
          type="password"
          placeholder="Mat khau"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: "" }));
            }
          }}
          onBlur={handlePasswordBlur}
          error={errors.password}
        />

        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-sm text-blue-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          Quen mat khau?
        </button>
      </div>

      <Button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full mt-6 bg-blue-500 hover:bg-blue-600"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Dang xu ly...</span>
          </div>
        ) : (
          "Dang nhap"
        )}
      </Button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Chua co tai khoan?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:underline font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          Dang ky ngay
        </button>
      </p>
    </Modal>
  );
};

export default LoginModal;
