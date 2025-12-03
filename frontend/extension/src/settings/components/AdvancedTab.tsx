import React, { useState } from "react";
import clsx from "clsx";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, RefreshCw } from "lucide-react";
import { LogLevel, ActivityLog, SecuritySettings } from "../../types/common";
import SettingToggle from "./SettingToggle";

interface AdvancedTabProps {
  onExportSettings: (format: "json" | "csv") => void | Promise<void>;
  onImportSettings: (file: File) => void | Promise<void>;
  isLoading?: {
    saving: boolean;
    resetting: boolean;
    exporting: boolean;
    importing: boolean;
  };
  customFilters: string[];
  vpnEnabled?: boolean;
  onUpdateSecurity: (updates: Partial<SecuritySettings>) => void;
}

const surface =
  "bg-white/90 dark:bg-slate-900/70 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/70 backdrop-blur";
const softSurface =
  "bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-sm backdrop-blur";

const logTone = {
  error: {
    bg: "bg-[#fef2f2]",
    border: "border-red-200",
    text: "text-red-800",
    pill: "bg-red-100 text-red-700",
    icon: "text-red-600",
    Icon: AlertCircle,
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    pill: "bg-amber-100 text-amber-700",
    icon: "text-amber-600",
    Icon: AlertTriangle,
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    pill: "bg-blue-100 text-blue-700",
    icon: "text-blue-600",
    Icon: Info,
  },
  debug: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-800",
    pill: "bg-slate-100 text-slate-700",
    icon: "text-slate-600",
    Icon: Info,
  },
} as const;

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  onExportSettings,
  onImportSettings,
  isLoading = { saving: false, resetting: false, exporting: false, importing: false },
  customFilters,
  vpnEnabled = false,
  onUpdateSecurity,
}) => {
  const [logLevel, setLogLevel] = useState<LogLevel>("debug");
  const [newFilter, setNewFilter] = useState("");

  const handleAddFilter = () => {
    if (newFilter.trim() && !customFilters.includes(newFilter.trim())) {
      onUpdateSecurity({ customFilters: [...customFilters, newFilter.trim()] });
      setNewFilter("");
    }
  };

  const handleRemoveFilter = (filter: string) => {
    onUpdateSecurity({ customFilters: customFilters.filter((f) => f !== filter) });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportSettings(file);
    }
  };

  const activityLogs: ActivityLog[] = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      level: "error",
      message: "Không thể cập nhật bộ lọc",
      details: "Failed to update filter database",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      level: "warning",
      message: "Phát hiện 5 mối đe dọa",
      details: "5 threats detected and blocked",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      level: "info",
      message: "Bảo vệ thời gian thực đã được bật",
      details: "User enabled real-time protection",
    },
  ];

  const hardenedLogs: ActivityLog[] = [
    {
      id: "err-purchase",
      timestamp: new Date().toISOString(),
      level: "error",
      message: "Thanh toán thất bại: không đủ tiền trong tài khoản",
      details: "Purchase PRO plan bị từ chối do số dư không đủ",
    },
    {
      id: "filter-sync",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      level: "info",
      message: "Cập nhật bộ lọc thành công",
      details: "Danh sách bộ lọc đã được đồng bộ với máy chủ",
    },
    {
      id: "rtp-enabled",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      level: "info",
      message: "Bảo vệ thời gian thực đã được bật",
      details: "Người dùng đã bật bảo vệ thời gian thực",
    },
  ];

  const visibleLogs =
    logLevel === "debug" ? hardenedLogs : hardenedLogs.filter((log) => log.level === logLevel);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8" role="tabpanel" id="tabpanel-advanced" aria-labelledby="tab-advanced">
      <div className={`${surface} p-6 mb-6`}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Tính năng nâng cao
        </h2>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-2xl border border-blue-200/60 dark:border-slate-700 mb-4 shadow-sm">
          <div className="flex-1">
            <div className="flex items-center mb-1 gap-2">
              <svg className="w-5 h-5 text-blue-700 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-900 dark:text-white">VPN Bảo Mật</h3>
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">PRO</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">Mã hóa kết nối và ẩn địa chỉ IP của bạn</p>
          </div>
          <SettingToggle
            checked={vpnEnabled}
            onChange={(next) => onUpdateSecurity({ vpnEnabled: next })}
            aria-label="Bật/Tắt VPN"
          />
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Bộ lọc tùy chỉnh</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Thêm mẫu URL để chặn hoặc cho phép cụ thể</p>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newFilter}
              onChange={(e) => setNewFilter(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddFilter()}
              placeholder="Nhập pattern (vd: *.example.com)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddFilter}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            {customFilters.map((filter) => (
              <div key={filter} className={`flex items-center justify-between p-3 ${softSurface}`}>
                <span className="font-mono text-sm text-gray-900 dark:text-white">{filter}</span>
                <button
                  onClick={() => handleRemoveFilter(filter)}
                  className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200/70 dark:border-slate-800/70 pt-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Import/Export Cài Đặt</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 ${softSurface}`}>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Xuất cài đặt</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Sao lưu cấu hình hiện tại của bạn</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => onExportSettings("json")}
                  disabled={isLoading.exporting}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading.exporting ? (
                    <>
                      <svg className="w-4 h-4 inline mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Xuất...
                    </>
                  ) : (
                    "JSON"
                  )}
                </button>
                <button
                  onClick={() => onExportSettings("csv")}
                  disabled={isLoading.exporting}
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading.exporting ? (
                    <>
                      <svg className="w-4 h-4 inline mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Xuất...
                    </>
                  ) : (
                    "CSV"
                  )}
                </button>
              </div>
            </div>

            <div className={`p-4 ${softSurface}`}>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Nhập cài đặt</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Khôi phục từ file đã sao lưu</p>
              <label
                className={`block w-full px-3 py-2 rounded-lg transition-colors text-sm font-medium text-center cursor-pointer ${
                  isLoading.importing ? "bg-gray-400 text-white cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={handleFileImport}
                  disabled={isLoading.importing}
                  className="hidden"
                />
                {isLoading.importing ? (
                  <>
                    <svg className="w-4 h-4 inline mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang nhập...
                  </>
                ) : (
                  "Chọn file"
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={`${surface} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Activity Logs
          </h2>

          <select
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value as LogLevel)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="debug">Tất cả</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="space-y-4">
          {visibleLogs.map((log) => {
            const tone = logTone[log.level];
            const Icon = tone.Icon;
            return (
              <div
                key={log.id}
                className={clsx("flex gap-3 rounded-xl border p-4 shadow-sm", tone.bg, tone.border)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                  <Icon className={clsx("h-5 w-5", tone.icon)} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={clsx("rounded-full px-2 py-0.5 text-xs font-semibold", tone.pill)}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600">{new Date(log.timestamp).toLocaleString("vi-VN")}</span>
                    </div>
                    {log.level === "error" && (
                      <button className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700">
                        <RefreshCw className="h-3 w-3" />
                        Thử lại
                      </button>
                    )}
                  </div>
                  <p className={clsx("text-sm font-semibold", tone.text)}>{log.message}</p>
                  {log.details && <p className="text-xs text-gray-700">{log.details}</p>}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onExportSettings("csv")}
          className="mt-4 w-full rounded-lg bg-blue-50 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
        >
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Xuất logs (CSV/PDF)
        </button>
      </div>
    </div>
  );
};

export default React.memo(AdvancedTab);
