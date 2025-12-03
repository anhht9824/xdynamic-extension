import React from "react";
import { Button } from "../../components/ui/button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

interface ExperienceTipsScreenProps {
  onComplete: () => Promise<void> | void;
  onBack: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}

const tips = [
  {
    title: "Quyền truy cập web",
    description:
      "Cho phép XDynamic đọc URL để lọc và chặn nội dung độc hại theo thời gian thực.",
  },
  {
    title: "Thông báo",
    description:
      "Nhận cảnh báo khi phát hiện rủi ro, tình trạng bảo vệ và nhật ký bảo vệ.",
  },
  {
    title: "Đồng bộ tài khoản",
    description:
      "Giữ cài đặt, whitelist/blacklist và mức bảo vệ đồng nhất trên mọi thiết bị.",
  },
];

const ExperienceTipsScreen: React.FC<ExperienceTipsScreenProps> = ({
  onComplete,
  onBack,
  isLoading,
  errorMessage,
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">Bước 5/5</p>
          <h3 className="text-lg font-bold text-gray-900">
            Quyền cần thiết & hoàn tất
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
        <div className="rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 p-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-lg font-semibold">Sẵn sàng kích hoạt</h4>
              <p className="text-sm text-white/80">
                Cấp quyền để bắt đầu bảo vệ. Bạn có thể thay đổi bất cứ lúc nào.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm"
            >
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {tip.title}
                </p>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
          ))}
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
            className="h-11 bg-blue-700 text-white hover:bg-blue-800 sm:w-48"
            onClick={onComplete}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" className="text-white" />
                Đang hoàn tất...
              </span>
            ) : (
              "Hoàn tất & vào Dashboard"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTipsScreen;
