import React, { useState } from "react";
import { SecuritySettings } from "../../types/common";
import WebsiteManagement from "./WebsiteManagement";
import SettingToggle from "./SettingToggle";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { Language } from "../../types";

const copy: Record<
  Language,
  {
    title: string;
    unsaved: string;
    realtime: { title: string; desc: string; active: string; aria: string };
    autoUpdate: { title: string; desc: string; last: string; aria: string };
    sensitivity: {
      title: string;
      hint: string;
      aria: string;
      low: string;
      high: string;
      risk: string;
    };
    actions: {
      viewLogs: string;
      reset: string;
      resetting: string;
      save: string;
      saving: string;
    };
    notice: { title: string; body: string };
  }
> = {
  vi: {
    title: "Cài đặt bảo vệ",
    unsaved: "Có thay đổi chưa lưu",
    realtime: {
      title: "Bảo vệ theo thời gian thực",
      desc: "Chặn nội dung độc hại ngay lập tức",
      active: "Đang hoạt động · 2.4M trang đã chặn hôm nay",
      aria: "Bật/Tắt bảo vệ theo thời gian thực",
    },
    autoUpdate: {
      title: "Tự động cập nhật bộ lọc",
      desc: "Cập nhật danh sách đen mỗi ngày",
      last: "Lần cập nhật cuối: Hôm nay, 08:30",
      aria: "Bật/Tắt tự động cập nhật",
    },
    sensitivity: {
      title: "Độ nhạy lọc nội dung",
      hint: "Cao hơn = chặt chẽ hơn, có thể chặn nhầm",
      aria: "Độ nhạy lọc nội dung",
      low: "Thấp",
      high: "Cao",
      risk: "Ở mức này, có thể chặn 5% trang lành tính",
    },
    actions: {
      viewLogs: "Xem logs",
      reset: "Đặt lại",
      resetting: "Đang đặt lại...",
      save: "Lưu cài đặt",
      saving: "Đang lưu...",
    },
    notice: {
      title: "Lưu ý về cài đặt bảo vệ",
      body: "Tắt bảo vệ thời gian thực có thể khiến thiết bị dễ bị tấn công. Khuyến nghị giữ các tính năng ở trạng thái BẬT để có trải nghiệm an toàn nhất.",
    },
  },
  en: {
    title: "Protection settings",
    unsaved: "Unsaved changes",
    realtime: {
      title: "Real-time protection",
      desc: "Block harmful content instantly",
      active: "Active · 2.4M pages blocked today",
      aria: "Toggle real-time protection",
    },
    autoUpdate: {
      title: "Auto update filters",
      desc: "Refresh blocklists daily",
      last: "Last update: Today, 08:30",
      aria: "Toggle auto update",
    },
    sensitivity: {
      title: "Content sensitivity",
      hint: "Higher = stricter, may block benign pages",
      aria: "Content sensitivity",
      low: "Low",
      high: "High",
      risk: "At this level, up to 5% benign pages may be blocked",
    },
    actions: {
      viewLogs: "View logs",
      reset: "Reset",
      resetting: "Resetting...",
      save: "Save settings",
      saving: "Saving...",
    },
    notice: {
      title: "Protection notice",
      body: "Turning off real-time protection may leave your device vulnerable. Keep features ON for the safest experience.",
    },
  },
};

interface OverviewTabProps {
  settings: SecuritySettings;
  onSave: (settings: SecuritySettings) => void | Promise<void>;
  onViewLogs: () => void;
  onReset: () => void;
  isLoading?: {
    saving: boolean;
    resetting: boolean;
    exporting: boolean;
    importing: boolean;
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  settings: initialSettings,
  onSave,
  onViewLogs,
  onReset,
  isLoading = { saving: false, resetting: false, exporting: false, importing: false },
}) => {
  const { language } = useLanguageContext();
  const text = copy[language];

  const [settings, setSettings] = useState<SecuritySettings>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  React.useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleToggle = (key: keyof SecuritySettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const updateSpeedLimit = (value: number) => {
    const clamped = Math.min(100, Math.max(0, value));
    setSettings((prev) => ({ ...prev, speedLimit: clamped }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(settings);
    setHasChanges(false);
  };

  const handleResetClick = () => {
    onReset();
    setHasChanges(false);
  };

  const surface =
    "bg-white/90 dark:bg-slate-900/70 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/70 backdrop-blur";
  const softSurface =
    "bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/70 rounded-2xl shadow-sm backdrop-blur";

  const sliderSteps = [0, 25, 50, 75, 100];
  const sliderPosition = Math.min(Math.max(settings.speedLimit, 2), 98);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8" role="tabpanel" id="tabpanel-overview" aria-labelledby="tab-overview">
      <div className={`${surface} p-6 mb-6`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {text.title}
          </h2>
          {hasChanges && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium animate-pulse">
              {text.unsaved}
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 ${softSurface} hover:bg-slate-50/95 dark:hover:bg-slate-900/70 transition-colors`}>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-white">{text.realtime.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{text.realtime.desc}</p>
              {settings.realTimeProtection && (
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {text.realtime.active}
                </div>
              )}
            </div>
            <SettingToggle
              checked={settings.realTimeProtection}
              onChange={() => handleToggle("realTimeProtection")}
              aria-label={text.realtime.aria}
            />
          </div>

          <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 ${softSurface} hover:bg-slate-50/95 dark:hover:bg-slate-900/70 transition-colors`}>
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-white">{text.autoUpdate.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{text.autoUpdate.desc}</p>
              {settings.autoUpdate && (
                <div className="text-xs text-gray-600 dark:text-gray-300">{text.autoUpdate.last}</div>
              )}
            </div>
            <SettingToggle
              checked={settings.autoUpdate}
              onChange={() => handleToggle("autoUpdate")}
              aria-label={text.autoUpdate.aria}
            />
          </div>

          <div className={`p-4 ${softSurface}`}>
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-900 dark:text-white">{text.sensitivity.title}</h3>
              <span className="ml-auto text-sm font-semibold text-blue-600">{settings.speedLimit}%</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {text.sensitivity.hint}
            </p>
            <div className="relative">
              <div className="absolute -top-7 left-0 w-full pointer-events-none">
                <div className="relative h-0">
                  <span
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white shadow"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    {settings.speedLimit}%
                  </span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={settings.speedLimit}
                onChange={(e) => updateSpeedLimit(Number(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    updateSpeedLimit(settings.speedLimit - 5);
                  }
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    updateSpeedLimit(settings.speedLimit + 5);
                  }
                }}
                className="flex-1 h-2 w-full appearance-none rounded-full bg-gray-200 dark:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${settings.speedLimit}%, #E5E7EB ${settings.speedLimit}%, #E5E7EB 100%)`,
                }}
                aria-label={text.sensitivity.aria}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={settings.speedLimit}
                aria-valuetext={`${settings.speedLimit}%`}
              />
              <div className="mt-2 flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
                {sliderSteps.map((step) => (
                  <span key={step} className="flex flex-col items-center">
                    <span className="mb-1 h-2 w-px bg-gray-400" />
                    {step}%
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{text.sensitivity.low}</span>
              <span>{text.sensitivity.high}</span>
            </div>
            {settings.speedLimit > 80 && (
              <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {text.sensitivity.risk}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800/70 gap-3">
          <div className="flex space-x-3">
            <button
              onClick={onViewLogs}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors font-medium text-sm"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {text.actions.viewLogs}
            </button>
            <button
              onClick={handleResetClick}
              disabled={isLoading.resetting}
              className="px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading.resetting ? (
                <>
                  <svg className="w-4 h-4 inline mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {text.actions.resetting}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {text.actions.reset}
                </>
              )}
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isLoading.saving}
            className={`px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              hasChanges && !isLoading.saving
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400"
            }`}
          >
            {isLoading.saving ? (
              <>
                <svg className="w-4 h-4 inline mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {text.actions.saving}
              </>
            ) : (
              <>
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {text.actions.save}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
              {text.notice.title}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              {text.notice.body}
            </p>
          </div>
        </div>
      </div>

      <WebsiteManagement onSave={() => setHasChanges(true)} />
    </div>
  );
};

export default React.memo(OverviewTab);
