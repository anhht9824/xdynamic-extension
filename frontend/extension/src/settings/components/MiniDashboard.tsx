import React, { useState, useEffect } from "react";
import { DashboardMetrics } from "../../types/common";

interface MiniDashboardProps {
  onUpgrade: () => void;
  onViewDetails: () => void;
  onToggleProtection: (enabled: boolean) => void;
  onToggleAutoUpdate: (enabled: boolean) => void;
}

const MiniDashboard: React.FC<MiniDashboardProps> = ({
  onUpgrade,
  onViewDetails,
  onToggleProtection,
  onToggleAutoUpdate,
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    usagePercentage: 70,
    usedGB: 7.0,
    totalGB: 10.0,
    usageUnit: "GB",
    blockedToday: 42,
    protectionStatus: "on",
    autoUpdate: true,
    speedLimit: 70,
  });

  const [refreshing, setRefreshing] = useState(false);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate metric updates
      setMetrics((prev) => ({
        ...prev,
        blockedToday: prev.blockedToday + Math.floor(Math.random() * 3),
        usagePercentage: Math.min(100, prev.usagePercentage + Math.random() * 0.5),
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleToggleProtection = () => {
    const newStatus = metrics.protectionStatus === "on" ? "off" : "on";
    setMetrics((prev) => ({ ...prev, protectionStatus: newStatus }));
    onToggleProtection(newStatus === "on");
  };

  const handleToggleAutoUpdate = () => {
    const newValue = !metrics.autoUpdate;
    setMetrics((prev) => ({ ...prev, autoUpdate: newValue }));
    onToggleAutoUpdate(newValue);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Tổng quan nhanh
          </h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Làm mới dữ liệu"
          >
            <svg
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
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
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Usage Gauge Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Hạn mức sử dụng
              </h3>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.usagePercentage.toFixed(0)}%
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {Number.isFinite(metrics.usedGB) ? metrics.usedGB.toLocaleString("en-US", { maximumFractionDigits: metrics.usageUnit === "lần" ? 0 : 1 }) : "0"}
                  /
                  {Number.isFinite(metrics.totalGB) ? metrics.totalGB.toLocaleString("en-US", { maximumFractionDigits: metrics.usageUnit === "lần" ? 0 : 1 }) : "0"}{" "}
                  {metrics.usageUnit || "GB"}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    metrics.usagePercentage >= 90
                      ? "bg-red-500"
                      : metrics.usagePercentage >= 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${metrics.usagePercentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Đã lọc và chặn</p>
          </div>

          {/* Real-time Protection Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bảo vệ thời gian thực
              </h3>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.protectionStatus === "on" ? "BẬT" : "TẮT"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {metrics.blockedToday} mục hôm nay
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={metrics.protectionStatus === "on"}
                  onChange={handleToggleProtection}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* Auto-update Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tự động cập nhật
              </h3>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.autoUpdate ? "BẬT" : "TẮT"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Lúc mở hình</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={metrics.autoUpdate}
                  onChange={handleToggleAutoUpdate}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {/* Upgrade Prompt Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 shadow-sm text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Nâng cấp gói</h3>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p className="text-sm mb-4 text-white/90">
              Mở khóa tính năng cao cấp và bảo vệ nâng cao
            </p>
            <button
              onClick={onUpgrade}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Nâng cấp ngay
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Alerts Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Ngôn ngữ giới hạn
              </h3>
              <button
                onClick={onViewDetails}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Xem chi tiết →
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Phát hiện {metrics.blockedToday} mục không an toàn hôm nay
            </p>
            <div className="flex space-x-2">
              <button
                onClick={onViewDetails}
                className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
              >
                Xem logs
              </button>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                </svg>
                Hỗ trợ và khắc phục sự cố
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Cần trợ giúp? Liên hệ với đội hỗ trợ của chúng tôi
            </p>
            <button
              className="w-full bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
            >
              Mở hỗ trợ chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniDashboard;
