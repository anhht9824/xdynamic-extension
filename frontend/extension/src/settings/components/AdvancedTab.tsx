import React, { useState } from "react";
import clsx from "clsx";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, RefreshCw } from "lucide-react";
import { LogLevel, ActivityLog, SecuritySettings } from "../../types/common";
import SettingToggle from "./SettingToggle";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { Language } from "../../types";

const surface =
  "bg-white/90 dark:bg-slate-900/70 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/70 backdrop-blur";
const softSurface =
  "bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 shadow-sm backdrop-blur";

const logTone = {
  error: {
    bg: "bg-[#fef2f2] dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800/60",
    text: "text-red-800 dark:text-red-100",
    pill: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200",
    icon: "text-red-600 dark:text-red-200",
    Icon: AlertCircle,
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/60",
    text: "text-amber-800 dark:text-amber-100",
    pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200",
    icon: "text-amber-600 dark:text-amber-200",
    Icon: AlertTriangle,
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800/60",
    text: "text-blue-800 dark:text-blue-100",
    pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200",
    icon: "text-blue-600 dark:text-blue-200",
    Icon: Info,
  },
  debug: {
    bg: "bg-slate-50 dark:bg-slate-900/50",
    border: "border-slate-200 dark:border-slate-800/60",
    text: "text-slate-800 dark:text-slate-100",
    pill: "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
    icon: "text-slate-600 dark:text-slate-200",
    Icon: Info,
  },
} as const;

const copy: Record<
  Language,
  {
    title: string;
    vpn: { title: string; desc: string; aria: string; badge: string };
    filters: { title: string; desc: string; placeholder: string; add: string };
    importExport: {
      title: string;
      exportTitle: string;
      exportDesc: string;
      exportLabel: string;
      importTitle: string;
      importDesc: string;
      importLabel: string;
      importing: string;
      uploading: string;
    };
    logs: { title: string; level: string; filters: string[]; empty: string };
    toggles: {
      vpn: string;
      alerts: string;
      summaries: string;
      quarantine: string;
      harden: string;
      logLevelLabel: string;
    };
    alerts: { success: string; warning: string; info: string };
    buttons: { exportJson: string; exportCsv: string; viewMore: string };
    activity: ActivityLog[];
    hardened: ActivityLog[];
  }
> = {
  vi: {
    title: "Tính năng nâng cao",
    vpn: { title: "VPN Bảo Mật", desc: "Mã hoá kết nối và ẩn địa chỉ IP của bạn", aria: "Bật/Tắt VPN", badge: "PRO" },
    filters: {
      title: "Bộ lọc tuỳ chỉnh",
      desc: "Thêm mẫu URL để chặn hoặc cho phép cụ thể",
      placeholder: "Nhập pattern (vd: *.example.com)",
      add: "Thêm",
    },
    importExport: {
      title: "Import/Export Cài Đặt",
      exportTitle: "Xuất cài đặt",
      exportDesc: "Sao lưu cấu hình hiện tại của bạn",
      exportLabel: "Xuất...",
      importTitle: "Nhập cài đặt",
      importDesc: "Khôi phục từ file đã sao lưu",
      importLabel: "Chọn file",
      importing: "Đang nhập...",
      uploading: "Đang tải lên...",
    },
    logs: { title: "Logs & chẩn đoán", level: "Mức log", filters: ["Tất cả", "Cảnh báo", "Thông tin", "Debug"], empty: "Không có log nào" },
    toggles: {
      vpn: "Bật/Tắt VPN",
      alerts: "Cảnh báo email & toast",
      summaries: "Gửi tóm tắt hằng ngày",
      quarantine: "Cô lập tập tin nghi ngờ",
      harden: "Chế độ cứng hoá",
      logLevelLabel: "Mức log",
    },
    alerts: {
      success: "Cập nhật thành công. Mọi thay đổi đã được áp dụng.",
      warning: "Lưu ý: tắt cảnh báo có thể bỏ lỡ sự cố quan trọng.",
      info: "Chế độ cứng hoá giúp khoá cấu hình khỏi các thay đổi ngẫu nhiên.",
    },
    buttons: { exportJson: "JSON", exportCsv: "CSV", viewMore: "Xem thêm" },
    activity: [
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
        message: "Phát hiện 5 mối đe doạ",
        details: "5 threats detected and blocked",
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        level: "info",
        message: "Bảo vệ thời gian thực đã được bật",
        details: "Người dùng đã bật bảo vệ thời gian thực",
      },
    ],
    hardened: [
      {
        id: "err-purchase",
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Thanh toán thất bại: không đủ tiền trong tài khoản",
        details: "Purchase PRO plan bị từ chối do số dư không đủ",
      },
      {
        id: "warn-csrf",
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        level: "warning",
        message: "Cảnh báo CSRF cho domain lạ",
        details: "Chặn cookie cross-site khả nghi từ mail-ads.biz",
      },
      {
        id: "info-sync",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        level: "info",
        message: "Đồng bộ cài đặt thành công",
        details: "Đồng bộ quy tắc bảo vệ với popup & dashboard",
      },
      {
        id: "info-export",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        level: "info",
        message: "Đã xuất cài đặt",
        details: "Tải xuống file cấu hình JSON",
      },
    ],
  },
  en: {
    title: "Advanced features",
    vpn: { title: "Secure VPN", desc: "Encrypt connection and mask your IP address", aria: "Toggle VPN", badge: "PRO" },
    filters: {
      title: "Custom filters",
      desc: "Add URL patterns to block or allow",
      placeholder: "Enter pattern (e.g., *.example.com)",
      add: "Add",
    },
    importExport: {
      title: "Import/Export Settings",
      exportTitle: "Export settings",
      exportDesc: "Back up your current configuration",
      exportLabel: "Export...",
      importTitle: "Import settings",
      importDesc: "Restore from a saved file",
      importLabel: "Choose file",
      importing: "Importing...",
      uploading: "Uploading...",
    },
    logs: { title: "Logs & diagnostics", level: "Log level", filters: ["All", "Warnings", "Info", "Debug"], empty: "No logs available" },
    toggles: {
      vpn: "Toggle VPN",
      alerts: "Email & toast alerts",
      summaries: "Send daily summaries",
      quarantine: "Quarantine suspicious files",
      harden: "Hardened mode",
      logLevelLabel: "Log level",
    },
    alerts: {
      success: "Updated successfully. All changes applied.",
      warning: "Note: turning off alerts may hide critical incidents.",
      info: "Hardened mode locks configuration from accidental changes.",
    },
    buttons: { exportJson: "JSON", exportCsv: "CSV", viewMore: "View more" },
    activity: [
      {
        id: "1",
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Unable to update filters",
        details: "Failed to update filter database",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: "warning",
        message: "Detected 5 threats",
        details: "5 threats detected and blocked",
      },
      {
        id: "3",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        level: "info",
        message: "Real-time protection enabled",
        details: "User enabled real-time protection",
      },
    ],
    hardened: [
      {
        id: "err-purchase",
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Payment failed: insufficient balance",
        details: "Purchase PRO plan was declined due to low balance",
      },
      {
        id: "warn-csrf",
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        level: "warning",
        message: "CSRF warning for unfamiliar domain",
        details: "Blocked suspicious cross-site cookie from mail-ads.biz",
      },
      {
        id: "info-sync",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        level: "info",
        message: "Settings synced successfully",
        details: "Synced protection rules with popup & dashboard",
      },
      {
        id: "info-export",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        level: "info",
        message: "Settings exported",
        details: "Downloaded JSON config file",
      },
    ],
  },
};

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

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  onExportSettings,
  onImportSettings,
  isLoading = { saving: false, resetting: false, exporting: false, importing: false },
  customFilters,
  vpnEnabled = false,
  onUpdateSecurity,
}) => {
  const { language } = useLanguageContext();
  const text = copy[language];

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

  const activityLogs: ActivityLog[] = text.activity;
  const hardenedLogs: ActivityLog[] = text.hardened;

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
          {text.title}
        </h2>

        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-2xl border border-blue-200/60 dark:border-slate-700 mb-4 shadow-sm">
          <div className="flex-1">
            <div className="flex items-center mb-1 gap-2">
              <svg className="w-5 h-5 text-blue-700 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-900 dark:text-white">{text.vpn.title}</h3>
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">{text.vpn.badge}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">{text.vpn.desc}</p>
          </div>
          <SettingToggle
            checked={vpnEnabled}
            onChange={(next) => onUpdateSecurity({ vpnEnabled: next })}
            aria-label={text.vpn.aria}
          />
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{text.filters.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{text.filters.desc}</p>
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newFilter}
              onChange={(e) => setNewFilter(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddFilter()}
              placeholder={text.filters.placeholder}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddFilter}
              className="px-4 py-2 rounded-lg font-semibold transition-colors bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
              aria-label={text.filters.add}
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
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded transition-colors"
                  aria-label="Remove filter"
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
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{text.importExport.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 ${softSurface}`}>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{text.importExport.exportTitle}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{text.importExport.exportDesc}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => onExportSettings("json")}
                  disabled={isLoading.exporting}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25"
                >
                  {isLoading.exporting ? (
                    <>
                      <svg className="w-4 h-4 inline mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {text.importExport.exportLabel}
                    </>
                  ) : (
                    text.buttons.exportJson
                  )}
                </button>
                <button
                  onClick={() => onExportSettings("csv")}
                  disabled={isLoading.exporting}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-secondary text-foreground hover:bg-secondary/90 shadow-sm shadow-secondary/30"
                >
                  {isLoading.exporting ? (
                    <>
                      <svg className="w-4 h-4 inline mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {text.importExport.exportLabel}
                    </>
                  ) : (
                    text.buttons.exportCsv
                  )}
                </button>
              </div>
            </div>

            <div className={`p-4 ${softSurface}`}>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{text.importExport.importTitle}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{text.importExport.importDesc}</p>
              <label
                className={`block w-full px-3 py-2 rounded-lg transition-colors text-sm font-medium text-center cursor-pointer ${
                  isLoading.importing
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
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
                    {text.importExport.importing}
                  </>
                ) : (
                  text.importExport.importLabel
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={`${surface} p-6 mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{text.logs.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{text.logs.level}</p>
          </div>
          <div className="flex gap-2 items-center">
            {(["debug", "warning", "info"] as LogLevel[]).map((level, idx) => (
              <button
                key={level}
                onClick={() => setLogLevel(level)}
                className={clsx(
                  "px-3 py-1 rounded-full text-sm font-semibold border transition-colors",
                  logLevel === level
                    ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {text.logs.filters[idx]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {visibleLogs.length === 0 && (
            <div className="p-4 rounded-lg border border-dashed border-slate-300 text-sm text-slate-600 dark:text-slate-300">
              {text.logs.empty}
            </div>
          )}
          {visibleLogs.map((log) => {
            const tone = logTone[log.level];
            const Icon = tone.Icon;
            return (
              <div key={log.id} className={clsx("p-4 rounded-xl border", tone.bg, tone.border)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${tone.icon}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tone.pill}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className={clsx("mt-1 text-sm font-semibold", tone.text)}>{log.message}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{log.details}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`${surface} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 ${softSurface}`}>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{text.alerts.success}</p>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-1">
                  {language === "vi" ? "Không cần khởi động lại." : "No restart required."}
                </p>
              </div>
            </div>
          </div>
          <div className={`p-4 ${softSurface}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{text.alerts.warning}</p>
                <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
                  {language === "vi" ? "Hãy bật lại khi kiểm thử xong." : "Re-enable after testing."}
                </p>
              </div>
            </div>
          </div>
          <div className={`p-4 ${softSurface}`}>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{text.alerts.info}</p>
                <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-1">
                  {language === "vi" ? "Khoá thay đổi ngoài ý muốn." : "Locks against unintended changes."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AdvancedTab);
