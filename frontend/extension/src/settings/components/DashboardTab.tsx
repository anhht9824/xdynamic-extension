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
import { useLanguageContext } from "../../providers/LanguageProvider";
import { Language } from "../../types";

interface DashboardTabProps {
  metrics: DashboardMetrics;
  stats: UserStatistics;
  userProfile: UserProfile;
  onUpgrade: () => void;
  onRefresh: () => Promise<void>;
  onToggleProtection: (enabled: boolean) => void;
  onToggleAutoUpdate: (enabled: boolean) => void;
}

type DashboardCopy = {
  labels: {
    today: string;
    average: string;
  };
  cards: {
    blockedTitle: string;
    blockedSubtitle: string;
    blockedDescription: string;
    usageTitle: string;
    usageSubtitle: string;
    usageChange: (diff: number) => string;
    speedTitle: string;
    speedSubtitle: string;
  };
  settings: {
    title: string;
    badge: string;
    realtimeTitle: string;
    realtimeDescription: string;
    autoUpdateTitle: string;
    autoUpdateDescription: string;
    speedLimitTitle: string;
    speedLimitHint: string;
  };
  activity: {
    title: string;
    items: { title: string; subtitle: string }[];
  };
  quick: {
    title: string;
    badge: string;
    premiumTitle: string;
    premiumDescription: string;
    upgrade: string;
    report: string;
  };
  stats: {
    title: string;
    blocked: string;
    uptime: string;
    scanned: string;
    updated: string;
  };
  score: {
    title: string;
    caption: string;
  };
};

const copy: Record<Language, DashboardCopy> = {
  vi: {
    labels: {
      today: "Hôm nay",
      average: "Trung bình",
    },
    cards: {
      blockedTitle: "Đã chặn",
      blockedSubtitle: "Hôm nay",
      blockedDescription: "Nội dung không phù hợp đã được chặn",
      usageTitle: "Hạn mức sử dụng",
      usageSubtitle: "Giới hạn gói",
      usageChange: (diff) => `Tăng ${diff}% so với tuần trước`,
      speedTitle: "Tốc độ mạng",
      speedSubtitle: "Theo dõi trực tiếp",
    },
    settings: {
      title: "Cài đặt bảo vệ",
      badge: "Tuỳ chỉnh nhanh",
      realtimeTitle: "Bảo vệ thời gian thực",
      realtimeDescription: "Quét và chặn ngay lập tức",
      autoUpdateTitle: "Tự động cập nhật",
      autoUpdateDescription: "Luôn theo quy tắc mới nhất",
      speedLimitTitle: "Giới hạn tốc độ",
      speedLimitHint: "Điều chỉnh để tối ưu hiệu suất quét",
    },
    activity: {
      title: "Hoạt động gần đây",
      items: [
        {
          title: "Đã chặn nội dung không phù hợp",
          subtitle: "facebook.com • 2 phút trước",
        },
        {
          title: "Cảnh báo trang web nghi vấn",
          subtitle: "example-ads.com • 5 phút trước",
        },
        {
          title: "Cập nhật quy tắc bảo vệ",
          subtitle: "Hệ thống • 10 phút trước",
        },
      ],
    },
    quick: {
      title: "Thao tác nhanh",
      badge: "Ưu tiên",
      premiumTitle: "Mở khoá Premium",
      premiumDescription:
        "Không giới hạn dung lượng, bảo vệ AI nâng cao, hỗ trợ 24/7.",
      upgrade: "Nâng cấp ngay",
      report: "Báo cáo vấn đề",
    },
    stats: {
      title: "Thống kê chi tiết",
      blocked: "Tổng mối đe doạ đã chặn",
      uptime: "Thời gian hoạt động",
      scanned: "Trang web đã quét",
      updated: "Cập nhật cuối",
    },
    score: {
      title: "Điểm hiệu suất",
      caption: "Xuất sắc",
    },
  },
  en: {
    labels: {
      today: "Today",
      average: "Average",
    },
    cards: {
      blockedTitle: "Blocked",
      blockedSubtitle: "Today",
      blockedDescription: "Harmful content blocked",
      usageTitle: "Usage limit",
      usageSubtitle: "Plan allowance",
      usageChange: (diff) => `Up ${diff}% vs last week`,
      speedTitle: "Network speed",
      speedSubtitle: "Live monitoring",
    },
    settings: {
      title: "Protection settings",
      badge: "Quick controls",
      realtimeTitle: "Real-time protection",
      realtimeDescription: "Scan and block instantly",
      autoUpdateTitle: "Auto update",
      autoUpdateDescription: "Stay on the latest rules",
      speedLimitTitle: "Speed limit",
      speedLimitHint: "Adjust to optimise scanning",
    },
    activity: {
      title: "Recent activity",
      items: [
        {
          title: "Blocked unsafe content",
          subtitle: "facebook.com · 2 mins ago",
        },
        {
          title: "Suspicious site warning",
          subtitle: "example-ads.com · 5 mins ago",
        },
        {
          title: "Protection rules updated",
          subtitle: "System · 10 mins ago",
        },
      ],
    },
    quick: {
      title: "Quick actions",
      badge: "Priority",
      premiumTitle: "Unlock Premium",
      premiumDescription:
        "Unlimited quota, advanced AI protection, 24/7 support.",
      upgrade: "Upgrade now",
      report: "Report an issue",
    },
    stats: {
      title: "Detailed stats",
      blocked: "Total threats blocked",
      uptime: "Uptime",
      scanned: "Pages scanned",
      updated: "Last updated",
    },
    score: {
      title: "Performance score",
      caption: "Excellent",
    },
  },
};

const activityStyles = [
  {
    icon: <Ban className="h-5 w-5 text-red-600" />,
    container: "bg-red-50",
  },
  {
    icon: <Gauge className="h-5 w-5 text-amber-600" />,
    container: "bg-amber-50",
  },
  {
    icon: <Sparkles className="h-5 w-5 text-emerald-600" />,
    container: "bg-emerald-50",
  },
];

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
  const { language } = useLanguageContext();
  const text = copy[language];
  const locale = language === "vi" ? "vi-VN" : "en-US";
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
    Number.isFinite(val)
      ? val.toLocaleString(locale, { maximumFractionDigits: usageUnitLabel === "lan" ? 0 : 1 })
      : "0";

  const uptimeDisplay =
    typeof stats.uptimePercent === "number"
      ? `${stats.uptimePercent.toFixed(1)}%`
      : realtimeData.uptime;

  const totalScansDisplay =
    typeof stats.totalScans === "number" ? stats.totalScans.toLocaleString(locale) : "1,247";

  const lastUpdatedDisplay = stats.lastUpdatedAt
    ? new Date(stats.lastUpdatedAt).toLocaleDateString(locale, { day: "2-digit", month: "2-digit" })
    : text.labels.today;

  const usageChange = text.cards.usageChange(Math.max(0, metrics.usagePercentage - 60));

  return (
    <div className="space-y-12" role="tabpanel" id="tabpanel-dashboard" aria-labelledby="tab-dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatedCard delay={100} hover className={`${surface} p-4`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{text.cards.blockedTitle}</p>
                <p className="text-xs text-muted-foreground">{text.cards.blockedSubtitle}</p>
              </div>
              <Ban className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{metrics.blockedToday}</span>
              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                +{stats.todayBlocked}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{text.cards.blockedDescription}</p>
          </AnimatedCard>

          <AnimatedCard delay={200} hover className={`${surface} p-4`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{text.cards.usageTitle}</p>
                <p className="text-xs text-muted-foreground">
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
                <p className="mt-2 text-xs text-muted-foreground">{usageChange}</p>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={300} hover className={`${surface} p-4`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{text.cards.speedTitle}</p>
                <p className="text-xs text-muted-foreground">{text.cards.speedSubtitle}</p>
              </div>
              <Wifi className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-foreground">{Math.round(realtimeData.currentSpeed)}</span>
              <span className="text-sm text-muted-foreground">Mbps</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {text.labels.average}: {realtimeData.avgSpeed} Mbps
            </p>
          </AnimatedCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className={`${surface} p-6`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{text.settings.title}</h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{text.settings.badge}</span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{text.settings.realtimeTitle}</p>
                  <p className="text-xs text-muted-foreground">{text.settings.realtimeDescription}</p>
                </div>
                <SettingToggle
                  checked={protectionOn}
                  onChange={(next) => handleToggleProtection(next)}
                  aria-label={text.settings.realtimeTitle}
                />
              </div>

              <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{text.settings.autoUpdateTitle}</p>
                  <p className="text-xs text-muted-foreground">{text.settings.autoUpdateDescription}</p>
                </div>
                <SettingToggle
                  checked={metrics.autoUpdate}
                  onChange={handleToggleAutoUpdate}
                  aria-label={text.settings.autoUpdateTitle}
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{text.settings.speedLimitTitle}</p>
                  <span className="text-sm font-semibold text-primary">{metrics.speedLimit}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${metrics.speedLimit}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{text.settings.speedLimitHint}</p>
              </div>
            </div>
          </div>

          <div className={`${surface} p-6`}>
            <div className="mb-4 flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-foreground">{text.activity.title}</h3>
            </div>
            <div className="space-y-4">
              {text.activity.items.map((item, index) => (
                <div key={item.title} className={`flex items-start gap-3 rounded-lg p-4 ${activityStyles[index]?.container || "bg-slate-50"}`}>
                  {activityStyles[index]?.icon}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className={`${surface} p-6`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">{text.quick.title}</h3>
              <span className="text-xs font-semibold text-primary">{text.quick.badge}</span>
            </div>

            <div className="mb-4 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{text.quick.premiumTitle}</p>
                  <p className="text-xs text-muted-foreground">{text.quick.premiumDescription}</p>
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
                <span className="font-semibold">{text.quick.upgrade}</span>
              </RippleButton>

              <RippleButton
                variant="secondary"
                size="lg"
                onClick={() => window.open(chrome.runtime.getURL("src/report/index.html"))}
                className="w-full !border !border-red-200 !bg-red-50 !text-red-600 hover:!bg-red-100"
              >
                <ActivityIcon className="h-4 w-4" />
                <span>{text.quick.report}</span>
              </RippleButton>
            </div>
          </div>

          <div className={`${surface} p-6`}>
            <h3 className="mb-4 text-lg font-semibold text-foreground">{text.stats.title}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{text.stats.blocked}</span>
                <span className="font-semibold text-foreground">{stats.totalBlocked}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{text.stats.uptime}</span>
                <span className="font-semibold text-emerald-600">{uptimeDisplay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{text.stats.scanned}</span>
                <span className="font-semibold text-foreground">{totalScansDisplay}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{text.stats.updated}</span>
                <span className="font-semibold text-foreground">{lastUpdatedDisplay}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-blue-50 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-foreground">{text.score.title}</h3>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-green-600">98</div>
              <p className="mb-4 text-sm text-muted-foreground">{text.score.caption}</p>
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

