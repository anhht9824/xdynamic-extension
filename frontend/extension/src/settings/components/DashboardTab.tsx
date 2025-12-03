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

const surface = "rounded-lg border border-border bg-card shadow-sm";

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
  const usageUnitLabel = metrics.usageUnit || "GB";
  const formatUsageValue = (val: number) =>
    Number.isFinite(val) ? val.toLocaleString("en-US", { maximumFractionDigits: usageUnitLabel === "lần" ? 0 : 1 }) : "0";

  const uptimeDisplay =
    typeof stats.uptimePercent === "number"
      ? `${stats.uptimePercent.toFixed(1)}%`
      : realtimeData.uptime;

  const totalScansDisplay =
    typeof stats.totalScans === "number" ? stats.totalScans.toLocaleString("en-US") : "1,247";

  const lastUpdatedDisplay =
    stats.lastUpdatedAt
      ? new Date(stats.lastUpdatedAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
      : "Hôm nay";

  return (
    <div className="space-y-12" role="tabpanel" id="tabpanel-dashboard" aria-labelledby="tab-dashboard">
      <div className="space-y-8">


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatedCard delay={100} hover className={`${surface} p-4`}>
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

          <AnimatedCard delay={200} hover className={`${surface} p-4`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">Hạn mức sử dụng</p>
                <p className="text-xs text-gray-500">
                  {formatUsageValue(metrics.usedGB)} / {formatUsageValue(metrics.totalGB)} {usageUnitLabel}
                </p>
              </div>
              <HardDrive className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center justify-between">
              <ProgressRing percentage={metrics.usagePercentage} size={88} strokeWidth={7} showLabel animated />
              <div className="ml-4 flex-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary/100 transition-all duration-500"
                    style={{ width: `${metrics.usagePercentage}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Tăng {Math.max(0, metrics.usagePercentage - 60).toFixed(0)}% so với tuần trước
                </p>
              </div>
            </div>
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
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Cài đặt bảo vệ</h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Tùy chỉnh nhanh</span>
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
                  <span className="text-sm font-semibold text-primary">{metrics.speedLimit}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
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
              <span className="text-xs font-semibold text-primary">Ưu tiên</span>
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
                className="w-full !bg-primary !text-white hover:!bg-blue-700"
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
                <span className="font-semibold text-emerald-600">{uptimeDisplay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trang web đã quét</span>
                <span className="font-semibold text-gray-900">{totalScansDisplay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cập nhật cuối</span>
                <span className="font-semibold text-gray-900">{lastUpdatedDisplay}</span>
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
