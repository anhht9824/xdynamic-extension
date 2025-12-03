import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import type { OnboardingPreferences } from "../../types/onboarding";

interface SecurityConfirmationScreenProps {
  preferences: OnboardingPreferences;
  onSubmit: (preferences: OnboardingPreferences) => Promise<boolean>;
  onBack: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}

const protectionLevels: {
  id: OnboardingPreferences["protectionLevel"];
  title: string;
  description: string;
  badge?: string;
}[] = [
  {
    id: "strict",
    title: "Nghiêm ngặt",
    description: "Chặn tối đa nội dung nhạy cảm, bạo lực, lừa đảo.",
    badge: "Đề xuất",
  },
  {
    id: "balanced",
    title: "Cân bằng",
    description: "Lọc nội dung độc hại phổ biến, vẫn đảm bảo trải nghiệm.",
  },
  {
    id: "custom",
    title: "Tùy chỉnh",
    description: "Tự quản lý whitelist/blacklist và mức cảnh báo.",
  },
];

const SecurityConfirmationScreen: React.FC<SecurityConfirmationScreenProps> = ({
  preferences,
  onSubmit,
  onBack,
  isLoading,
  errorMessage,
}) => {
  const [localPreferences, setLocalPreferences] =
    useState<OnboardingPreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleSave = async () => {
    await onSubmit(localPreferences);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">Bước 4/5</p>
          <h3 className="text-lg font-bold text-gray-900">
            Thiết lập bảo vệ & thông báo
          </h3>
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

      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-900">
            Chọn mức bảo vệ
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {protectionLevels.map((level) => {
              const isActive = localPreferences.protectionLevel === level.id;
              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() =>
                    setLocalPreferences((prev) => ({
                      ...prev,
                      protectionLevel: level.id,
                    }))
                  }
                  className={`flex h-full flex-col rounded-xl border p-4 text-left shadow-sm transition ${
                    isActive
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-100 bg-white hover:border-cyan-400 hover:bg-cyan-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {level.title}
                    </span>
                    {level.badge && (
                      <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                        {level.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {level.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-900">
            Tùy chỉnh thông báo
          </p>
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Nhận cảnh báo
                </div>
                <p className="text-sm text-gray-600">
                  Thông báo khi phát hiện nội dung độc hại hoặc hành vi bất
                  thường.
                </p>
              </div>
              <input
                type="checkbox"
                checked={localPreferences.notifications}
                onChange={(e) =>
                  setLocalPreferences((prev) => ({
                    ...prev,
                    notifications: e.target.checked,
                  }))
                }
                className="h-5 w-5 accent-blue-700"
              />
            </label>

            <label className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Chia sẻ dữ liệu ẩn danh
                </div>
                <p className="text-sm text-gray-600">
                  Cho phép gửi dữ liệu ẩn danh để cải thiện khả năng phát hiện.
                </p>
              </div>
              <input
                type="checkbox"
                checked={localPreferences.insights}
                onChange={(e) =>
                  setLocalPreferences((prev) => ({
                    ...prev,
                    insights: e.target.checked,
                  }))
                }
                className="h-5 w-5 accent-blue-700"
              />
            </label>
          </div>
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
            type="button"
            className="h-11 bg-blue-700 text-white hover:bg-blue-800 sm:w-40"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" className="text-white" />
                Đang lưu...
              </span>
            ) : (
              "Lưu & tiếp tục"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecurityConfirmationScreen;
