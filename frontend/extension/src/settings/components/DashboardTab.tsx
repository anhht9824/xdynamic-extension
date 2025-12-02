import React, { useEffect, useState } from "react";
import {
  Activity as ActivityIcon,
  ArrowUpRight,
  Ban,
  Gauge,
  HardDrive,
  RefreshCw,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  Wifi,
} from "lucide-react";
import { DashboardMetrics, UserProfile, UserStatistics } from "../../types/common";
import AnimatedCard from "./AnimatedCard";
import ProgressRing from "./ProgressRing";
import RippleButton from "./RippleButton";
import SettingToggle from "./SettingToggle";

interface DashboardTabProps {
  metrics: DashboardMetrics;
  stats: UserStatistics;
  userProfile: UserProfile;
  onUpgrade: () => void;
  onRefresh: () => Promise<void>;
  onToggleProtection: (enabled: boolean) => void;
  onToggleAutoUpdate: (enabled: boolean) => void;
}

const surface = "rounded-2xl border border-slate-200/80 bg-white shadow-sm";

const DashboardTab: React.FC<DashboardTabProps> = ({
  metrics,
  stats,
  userProfile,
  onUpgrade,
  onRefresh,
  onToggleProtection,
  onToggleAutoUpdate,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeData, setRealtimeData] = useState({
    currentSpeed: 45,
    avgSpeed: 42,
    uptime: "99.9%",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData((prev) => ({
        ...prev,
        currentSpeed: prev.currentSpeed + (Math.random() - 0.5) * 10,
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
      setRealtimeData((prev) => ({
        ...prev,
        currentSpeed: 45 + Math.random() * 20,
      }));
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleProtection = (nextEnabled?: boolean) => {
    const enabled = typeof nextEnabled === "boolean" ? nextEnabled : metrics.protectionStatus === "off";
    onToggleProtection(enabled);
  };

  const handleToggleAutoUpdate = () => {
    onToggleAutoUpdate(!metrics.autoUpdate);
  };

  const protectionOn = metrics.protectionStatus === "on";

  return (
    <div className="space-y-12" role="tabpanel" id="tabpanel-dashboard" aria-labelledby="tab-dashboard">
      <div className="space-y-8">
        <AnimatedCard
          delay={0}
          className="w-full rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 shadow-sm"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-blue-900/80">Trạng thái bảo vệ</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                      protectionOn ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {protectionOn ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                    {protectionOn ? "BẬT" : "TẮT"}
                  </span>
                  <span className="text-sm text-gray-700">
                    Bật để bảo vệ thiết bị của bạn, {userProfile.fullName || userProfile.email || "bạn"}.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <SettingToggle
                  size="lg"
                  checked={protectionOn}
                  onChange={(next) => handleToggleProtection(next)}
                  aria-label="Bật/Tắt bảo vệ"
                />
                <RippleButton
                  variant="ghost"
                  size="md"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-3 !bg-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <RefreshCw className={`h-5 w-5 text-blue-600 ${refreshing ? "animate-spin" : ""}`} />
                </RippleButton>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
                <Ban className="h-9 w-9 rounded-full bg-red-50 p-2 text-red-600" />
                <div>
                  <p className="text-xs text-gray-500">Đã chặn hôm nay</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.todayBlocked}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
                <HardDrive className="h-9 w-9 rounded-full bg-blue-50 p-2 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Dung lượng</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {metrics.usedGB}/{metrics.totalGB} GB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
                <Gauge className="h-9 w-9 rounded-full bg-emerald-50 p-2 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Uptime</p>
                  <p className="text-lg font-semibold text-gray-900">{realtimeData.uptime}</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatedCard delay={100} hover className={`${surface} p-4`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">Dung lượng</p>
                <p className="text-xs text-gray-500">
                  {metrics.usedGB} / {metrics.totalGB} GB
                </p>
              </div>
              <HardDrive className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <ProgressRing percentage={metrics.usagePercentage} size={88} strokeWidth={7} showLabel animated />
              <div className="ml-4 flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${metrics.usagePercentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Tăng {Math.max(0, metrics.usagePercentage - 60).toFixed(0)}% so với tuần trước
                </p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200} hover className={`${surface} p-4`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">Đã chặn</p>
                <p className="text-xs text-gray-500">Hôm nay</p>
              </div>
              <Ban className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{metrics.blockedToday}</span>
              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                +{stats.todayBlocked}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">Nội dung không phù hợp đã được chặn</p>
          </AnimatedCard>

          <AnimatedCard delay={300} hover className={`${surface} p-4`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">Tốc độ mạng</p>
                <p className="text-xs text-gray-500">Theo dõi trực tiếp</p>
              </div>
              <Wifi className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">{Math.round(realtimeData.currentSpeed)}</span>
              <span className="text-sm text-gray-500">Mbps</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">Trung bình: {realtimeData.avgSpeed} Mbps</p>
          </AnimatedCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className={`${surface} p-6`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Cài đặt bảo vệ</h3>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Tùy chỉnh nhanh</span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">Bảo vệ thời gian thực</p>
                  <p className="text-xs text-gray-600">Quét và chặn ngay lập tức</p>
                </div>
                <SettingToggle
                  checked={protectionOn}
                  onChange={(next) => handleToggleProtection(next)}
                  aria-label="Bật/Tắt bảo vệ thời gian thực"
                />
              </div>

              <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">Tự động cập nhật</p>
                  <p className="text-xs text-gray-600">Luôn tải quy tắc mới nhất</p>
                </div>
                <SettingToggle
                  checked={metrics.autoUpdate}
                  onChange={handleToggleAutoUpdate}
                  aria-label="Bật/Tắt tự động cập nhật"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">Giới hạn tốc độ</p>
                  <span className="text-sm font-semibold text-blue-600">{metrics.speedLimit}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${metrics.speedLimit}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-600">Điều chỉnh để tối ưu hiệu suất quét</p>
              </div>
            </div>
          </div>

          <div className={`${surface} p-6`}>
            <div className="mb-4 flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
                <Ban className="h-5 w-5 text-red-600" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">Đã chặn nội dung không phù hợp</p>
                  <p className="text-xs text-gray-600">facebook.com • 2 phút trước</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4">
                <Gauge className="h-5 w-5 text-amber-600" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">Cảnh báo trang web nghi vấn</p>
                  <p className="text-xs text-gray-600">example-ads.com • 5 phút trước</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">Cập nhật quy tắc bảo vệ</p>
                  <p className="text-xs text-gray-600">Hệ thống • 10 phút trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`${surface} p-6`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h3>
              <span className="text-xs font-semibold text-blue-600">Ưu tiên</span>
            </div>

            <div className="mb-4 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900">Mở khóa Premium</p>
                  <p className="text-xs text-gray-600">
                    Không giới hạn dung lượng, bảo vệ AI nâng cao, hỗ trợ 24/7.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <RippleButton
                variant="primary"
                size="lg"
                onClick={onUpgrade}
                className="w-full !bg-blue-600 !text-white hover:!bg-blue-700"
              >
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">Nâng cấp ngay</span>
              </RippleButton>

              <RippleButton
                variant="secondary"
                size="lg"
                onClick={() => window.open(chrome.runtime.getURL("src/report/index.html"))}
                className="w-full !border !border-red-200 !bg-red-50 !text-red-600 hover:!bg-red-100"
              >
                <ActivityIcon className="h-4 w-4" />
                <span>Báo cáo vấn đề</span>
              </RippleButton>
            </div>
          </div>

          <div className={`${surface} p-6`}>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Thống kê chi tiết</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tổng mối đe dọa đã chặn</span>
                <span className="font-semibold text-gray-900">{stats.totalBlocked}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thời gian hoạt động</span>
                <span className="font-semibold text-emerald-600">{realtimeData.uptime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trang web đã quét</span>
                <span className="font-semibold text-gray-900">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cập nhật cuối</span>
                <span className="font-semibold text-gray-900">Hôm nay</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-blue-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Điểm hiệu suất</h3>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-green-600">98</div>
              <p className="mb-4 text-sm text-gray-600">Xuất sắc</p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-green-600" style={{ width: "98%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardTab);
