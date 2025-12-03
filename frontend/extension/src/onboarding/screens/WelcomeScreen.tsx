import React from "react";
import { Button } from "../../components/ui/button";

interface WelcomeScreenProps {
  onStart: () => void;
  onSkip: () => void;
  onLogin?: () => void;
}

const FeatureBadge: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="rounded-lg border border-gray-100 bg-white/60 p-3 shadow-sm">
    <div className="text-sm font-semibold text-gray-900">{title}</div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onSkip,
  onLogin,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
      <div className="grid gap-8 p-8 lg:grid-cols-[1.6fr,1fr] lg:p-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-blue-700">
              Onboarding • 5 bước
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              Chào mừng đến với XDynamic
            </h2>
            <p className="text-base text-gray-600">
              Kích hoạt lớp bảo vệ nội dung độc hại, cảnh báo tức thời và điều
              khiển dễ dàng trên mọi thiết bị.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <FeatureBadge
              title="Lọc nội dung tức thời"
              description="Chặn nội dung độc hại, bạo lực, lừa đảo ngay khi truy cập."
            />
            <FeatureBadge
              title="Cảnh báo thông minh"
              description="Nhận thông báo khi phát hiện rủi ro, đảm bảo bạn luôn chủ động."
            />
            <FeatureBadge
              title="Tùy chỉnh linh hoạt"
              description="Chọn mức bảo vệ, quản lý whitelist/blacklist và cảnh báo."
            />
            <FeatureBadge
              title="Dữ liệu an toàn"
              description="Mã hóa, tuân thủ quyền riêng tư và dễ dàng quản lý tài khoản."
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 flex-1 bg-blue-700 text-white hover:bg-blue-800"
              onClick={onStart}
            >
              Bắt đầu thiết lập
            </Button>
            <Button
              variant="outline"
              className="h-11 flex-1 border-cyan-500 text-cyan-600 hover:bg-cyan-50"
              onClick={onSkip}
            >
              Thiết lập sau
            </Button>
          </div>

          {onLogin && (
            <div className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button
                onClick={onLogin}
                className="font-semibold text-blue-700 hover:underline"
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-500 p-8 text-white shadow-lg">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-white blur-3xl" />
            <div className="absolute right-0 top-20 h-32 w-32 rounded-full bg-white blur-2xl" />
          </div>
          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              ✓ Sẵn sàng bảo vệ
            </div>
            <h3 className="text-2xl font-bold leading-tight">
              Kiểm soát trải nghiệm lướt web của bạn.
            </h3>
            <p className="text-sm text-white/80">
              Chỉ mất vài phút để bật bảo vệ thời gian thực, đồng bộ trên mọi
              thiết bị và theo dõi cảnh báo.
            </p>
            <ul className="space-y-2 text-sm text-white/90">
              <li>• Cài đặt nhanh, không yêu cầu kỹ thuật.</li>
              <li>• Đồng bộ tài khoản, quản lý từ Dashboard.</li>
              <li>• Quyền riêng tư minh bạch, dữ liệu được mã hóa.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
