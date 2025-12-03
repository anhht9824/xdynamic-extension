import React, { useEffect, useMemo, useState } from "react";
import { useAuth, useStats } from "../../hooks";
import { userService } from "../../services/user.service";

interface DashboardScreenProps {
  onNavigateToReporting: () => void;
  onNavigateToPayment: () => void;
  onNavigateToUpgrade: () => void;
  onNavigateToPlanManagement?: () => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
}

interface DashboardMetrics {
  dataUsage: {
    used: number;
    total: number;
    unit: string;
  };
  speed: {
    current: number;
    average: number;
    unit: string;
    trend: number[];
  };
  billDueDate: string;
  blockedToday: number;
  protectionLevel: string;
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="group h-full w-full rounded-xl border border-gray-200 bg-white p-5 text-left shadow-none transition hover:border-blue-200 hover:shadow-sm"
  >
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition group-hover:bg-blue-100">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </button>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToReporting,
  onNavigateToPayment,
  onNavigateToUpgrade,
  onNavigateToPlanManagement,
  onNavigateToSettings,
}) => {
  const { user } = useAuth();
  const { blockedCount } = useStats();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    dataUsage: { used: 0, total: 0, unit: "GB" },
    speed: { current: 0, average: 0, unit: "Mbps", trend: [18, 24, 32, 28, 35, 42, 48] },
    billDueDate: "",
    blockedToday: blockedCount,
    protectionLevel: "On",
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const stats = await userService.getStatistics();
      setMetrics(prev => ({
        ...prev,
        blockedToday: stats.todayBlocked,
        // Map thêm các trường khác nếu API đã sẵn sàng
      }));
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  const getUsagePercentage = () => {
    if (!metrics.dataUsage.total) return 0;
    return (metrics.dataUsage.used / metrics.dataUsage.total) * 100;
  };

  const speedTrendMax = useMemo(
    () => Math.max(...metrics.speed.trend, 1),
    [metrics.speed.trend]
  );

  const getSpeedColor = () => {
    if (metrics.speed.current >= 45) return "text-blue-700";
    if (metrics.speed.current >= 30) return "text-cyan-600";
    return "text-amber-600";
  };

  const protectionColors = useMemo(() => {
    const isActive = metrics.protectionLevel.toLowerCase() !== "off";
    return isActive
      ? {
          badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-100",
          dot: "bg-cyan-500",
        }
      : {
          badgeBg: "bg-red-50 text-red-700 border-red-100",
          dot: "bg-red-500",
        };
  }, [metrics.protectionLevel]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">Dashboard</p>
            <h1 className="text-3xl font-bold text-gray-900">
              Chao mung, {user?.fullName || "Nguoi dung"}
            </h1>
            <p className="text-sm text-gray-600">
              Theo doi trang thai bao ve va su dung dich vu trong mot man hinh.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:opacity-60"
          >
            <svg
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Lam moi
          </button>
        </div>

        {/* Key Metrics */}
        <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
              <p className="text-sm text-gray-600">
                Trang thai bao ve & su dung theo thoi gian thuc
              </p>
            </div>
            <div className="text-xs text-gray-500">Tu dong dong bo tu API</div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Data Usage */}
            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Su dung du lieu</p>
                  <p className="text-xs text-gray-500">Gioi han goi</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-gray-900">
                  {metrics.dataUsage.used.toFixed(1)} {metrics.dataUsage.unit}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    Trong tong {metrics.dataUsage.total} {metrics.dataUsage.unit}
                  </span>
                  <span className="font-semibold text-blue-700">
                    {getUsagePercentage().toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-700 transition-all duration-300"
                    style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Speed */}
            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toc do mang</p>
                  <p className="text-xs text-gray-500">Trung binh & hien tai</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className={`text-3xl font-bold ${getSpeedColor()}`}>
                  {metrics.speed.current} {metrics.speed.unit}
                </div>
                <div className="text-sm text-gray-600">
                  Trung binh:{" "}
                  <span className="font-semibold text-gray-800">
                    {metrics.speed.average} {metrics.speed.unit}
                  </span>
                </div>
                <div className="flex h-16 items-end gap-1">
                  {metrics.speed.trend.map((value, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-full bg-gradient-to-t from-blue-100 to-blue-500"
                      style={{ height: `${(value / speedTrendMax) * 100}%`, minHeight: "10%" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bill Due Date */}
            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ngay thanh toan</p>
                  <p className="text-xs text-gray-500">Ky hoa don ke tiep</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-900">
                  {metrics.billDueDate || "Dang dong bo"}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Chuan bi thanh toan
                </div>
              </div>
            </div>

            {/* Protection */}
            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bao ve hom nay</p>
                  <p className="text-xs text-gray-500">Noi dung da chan</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-gray-900">{metrics.blockedToday}</div>
                <div className="text-sm text-gray-600">Noi dung da chan hom nay</div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border ${protectionColors.badgeBg}`}
                >
                  <span className={`h-2 w-2 rounded-full ${protectionColors.dot}`} />
                  {metrics.protectionLevel}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-600">
                Thao tac nhanh cho bao cao, thanh toan, nang cap
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ActionCard
              title="Bao cao loi"
              description="Gui bao cao su co hoac loi ky thuat"
              onClick={onNavigateToReporting}
              icon={
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />

            <ActionCard
              title="Thanh toan"
              description="Quan ly hoa don va lich thanh toan"
              onClick={onNavigateToPayment}
              icon={
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              }
            />

            <ActionCard
              title="Nang cap goi"
              description="Mo khoa them tinh nang bao ve"
              onClick={onNavigateToUpgrade}
              icon={
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />

            {onNavigateToPlanManagement && (
              <ActionCard
                title="Quan ly goi"
                description="Xem va thay doi goi dich vu"
                onClick={onNavigateToPlanManagement}
                icon={
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                }
              />
            )}

            <ActionCard
              title="Cai dat"
              description="Cau hinh tai khoan & bao ve"
              onClick={onNavigateToSettings}
              icon={
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M11.983 1.077a1 1 0 00-1.966 0l-.27 1.627a7.967 7.967 0 00-1.406.813L6.44 2.64a1 1 0 00-1.415 1.415l.876 1.901a7.967 7.967 0 00-.813 1.406l-1.627.27a1 1 0 000 1.966l1.627.27c.187.51.45.987.813 1.406l-.876 1.901a1 1 0 001.415 1.415l1.901-.876c.419.363.896.626 1.406.813l.27 1.627a1 1 0 001.966 0l.27-1.627a7.967 7.967 0 001.406-.813l1.901.876a1 1 0 001.415-1.415l-.876-1.901c.363-.419.626-.896.813-1.406l1.627-.27a1 1 0 000-1.966l-1.627-.27a7.967 7.967 0 00-.813-1.406l.876-1.901A1 1 0 0013.56 2.64l-1.901.876a7.967 7.967 0 00-1.406-.813l-.27-1.626zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardScreen;
