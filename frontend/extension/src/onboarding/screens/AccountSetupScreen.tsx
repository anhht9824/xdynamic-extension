import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { isValidEmail, VALIDATION } from "../../utils";
import type { OnboardingProfile } from "../../types/onboarding";

interface AccountSetupScreenProps {
  defaultValues: {
    fullName: string;
    email: string;
    phone?: string;
  };
  onSubmit: (
    payload: OnboardingProfile & { password: string }
  ) => Promise<boolean>;
  onBack: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}

const AccountSetupScreen: React.FC<AccountSetupScreenProps> = ({
  defaultValues,
  onSubmit,
  onBack,
  isLoading,
  errorMessage,
}) => {
  const [formData, setFormData] = useState({
    fullName: defaultValues.fullName,
    email: defaultValues.email,
    phone: defaultValues.phone ?? "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: defaultValues.fullName,
      email: defaultValues.email,
      phone: defaultValues.phone ?? "",
    }));
  }, [defaultValues]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const trimmedEmail = formData.email.trim();

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email là bắt buộc.";
    } else if (!isValidEmail(trimmedEmail)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!formData.password) {
      newErrors.password = "Cần tạo mật khẩu.";
    } else if (formData.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = `Mật khẩu tối thiểu ${VALIDATION.PASSWORD_MIN_LENGTH} ký tự.`;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone || undefined,
      password: formData.password,
    });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">Bước 2/5</p>
          <h3 className="text-lg font-bold text-gray-900">Tạo tài khoản</h3>
        </div>
        <Button
          variant="ghost"
          className="text-sm text-gray-600 hover:text-gray-800"
          onClick={onBack}
          type="button"
        >
          ← Quay lại
        </Button>
      </div>

      <form className="space-y-6 p-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ tên</Label>
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Nhập lại để xác nhận"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại (tuỳ chọn)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+84..."
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <p className="text-sm text-gray-500">
            Dùng để nhận cảnh báo quan trọng và hỗ trợ khôi phục.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 sm:w-32"
            onClick={onBack}
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            className="h-11 bg-blue-700 text-white hover:bg-blue-800 sm:w-40"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" className="text-white" />
                Đang tạo...
              </span>
            ) : (
              "Tiếp tục"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountSetupScreen;
