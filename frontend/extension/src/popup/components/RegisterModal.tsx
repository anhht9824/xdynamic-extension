import React, { useState } from "react";
import { FormInput, Button, Modal } from "../../components/ui";
import { logger, STORAGE_KEYS } from "../../utils";
import { useToast } from "../../providers";
import { authService } from "../../services/auth.service";
import { useAuth } from "../../hooks";

interface RegisterModalProps {
  onClose: () => void;
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  onClose,
  onRegisterSuccess,
  onSwitchToLogin,
}) => {
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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
    if (password.length < 6) {
      return "Mat khau phai co it nhat 6 ky tu";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (formData.password !== confirmPassword) {
      return "Mat khau khong khop";
    }
    return "";
  };

  const validateFullName = (fullName: string) => {
    if (!fullName) {
      return "Ten la bat buoc";
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

  const handleConfirmPasswordBlur = () => {
    const error = validateConfirmPassword(formData.confirmPassword);
    setErrors((prev) => ({ ...prev, confirmPassword: error }));
  };

  const handleFullNameBlur = () => {
    const error = validateFullName(formData.fullName);
    setErrors((prev) => ({ ...prev, fullName: error }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      showToast("error", "Vui long kiem tra lai thong tin");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({
        email: formData.email.trim(),
        password: formData.password,
      });

      const userData = {
        id: response.user.id,
        email: response.user.email,
        fullName: formData.fullName || response.user.email.split("@")[0],
      };

      signIn(userData);

      chrome.storage.local.set(
        {
          [STORAGE_KEYS.HAS_COMPLETED_ONBOARDING]: true,
          [STORAGE_KEYS.USER]: userData,
        },
        () => {
          chrome.storage.local.remove([STORAGE_KEYS.GUEST_MODE], () => {
            showToast("success", "Dang ky thanh cong!");
            onRegisterSuccess();
          });
        }
      );
    } catch (error) {
      logger.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Dang ky that bai. Vui long thu lai";
      showToast("error", errorMessage);
      setErrors({ email: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Dang ky" size="sm">
      <div className="space-y-4">
        <FormInput
          type="text"
          placeholder="Ho va ten"
          value={formData.fullName}
          onChange={(e) => {
            setFormData({ ...formData, fullName: e.target.value });
            if (errors.fullName) {
              setErrors((prev) => ({ ...prev, fullName: "" }));
            }
          }}
          onBlur={handleFullNameBlur}
          error={errors.fullName}
        />

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

        <FormInput
          type="password"
          placeholder="Xac nhan mat khau"
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData({ ...formData, confirmPassword: e.target.value });
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }
          }}
          onBlur={handleConfirmPasswordBlur}
          error={errors.confirmPassword}
        />
      </div>

      <Button
        onClick={handleRegister}
        disabled={isLoading}
        className="w-full mt-6 bg-green-500 hover:bg-green-600"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Dang xu ly...</span>
          </div>
        ) : (
          "Dang ky"
        )}
      </Button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Da co tai khoan?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          Dang nhap
        </button>
      </p>
    </Modal>
  );
};

export default RegisterModal;
