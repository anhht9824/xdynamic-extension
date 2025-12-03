import React from "react";
import { Moon, Sun } from "lucide-react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useThemeContext } from "../../providers/ThemeProvider";
import { Language, Theme } from "../../types";

export type SettingsSection =
  | "dashboard"
  | "overview"
  | "account"
  | "advanced";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

const navItems: { id: SettingsSection; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "overview",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: "account",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: "advanced",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const copy: Record<
  "vi" | "en",
  {
    title: string;
    closeMenu: string;
    sections: Record<SettingsSection, { label: string; description: string }>;
    language: { title: string; description: string; helper: string; vi: string; en: string };
    theme: {
      title: string;
      description: string;
      note: string;
      options: { light: string; dark: string };
      preview: { light: string; dark: string };
    };
    help: { title: string; body: string; cta: string };
  }
> = {
  vi: {
    title: "Cài đặt",
    closeMenu: "Đóng menu",
    sections: {
      dashboard: { label: "Trang chủ", description: "Tổng quan về thống kê" },
      overview: { label: "Bảo mật", description: "Cài đặt bảo vệ và an ninh" },
      account: { label: "Tài khoản", description: "Thông tin cá nhân và riêng tư" },
      advanced: { label: "Nâng cao", description: "Tuỳ chỉnh chi tiết và xuất dữ liệu" },
    },
    language: {
      title: "Thay đổi ngôn ngữ",
      description: "Đồng bộ Popup & Dashboard",
      helper: "Đồng bộ ngôn ngữ giữa Popup, Dashboard và các tab sử dụng chung.",
      vi: "Tiếng Việt",
      en: "English",
    },
    theme: {
      title: "Chế độ giao diện",
      description: "Áp dụng cho Dashboard/User Hub",
      note: "Theme chỉ áp dụng cho Dashboard và các tab có giao diện này.",
      options: { light: "Light", dark: "Dark" },
      preview: {
        light: "Ưu tiên Light",
        dark: "Ưu tiên Dark",
      },
    },
    help: {
      title: "Cần trợ giúp?",
      body: "Tìm hiểu thêm về các tính năng và cài đặt",
      cta: "Xem hướng dẫn",
    },
  },
  en: {
    title: "Settings",
    closeMenu: "Close menu",
    sections: {
      dashboard: { label: "Home", description: "Overview and metrics" },
      overview: { label: "Security", description: "Protection and safety rules" },
      account: { label: "Account", description: "Profile and privacy" },
      advanced: { label: "Advanced", description: "Power controls and exports" },
    },
    language: {
      title: "Language",
      description: "Syncs with popup & dashboard",
      helper: "Selection stays aligned across Popup, Dashboard and related tabs.",
      vi: "Vietnamese",
      en: "English",
    },
    theme: {
      title: "Theme",
      description: "Applies to Dashboard/User Hub",
      note: "Theme changes only affect the Dashboard and shared tabs. Popup stays unchanged.",
      options: { light: "Light", dark: "Dark" },
      preview: {
        light: "Using Light",
        dark: "Using Dark",
      },
    },
    help: {
      title: "Need help?",
      body: "Learn more about features and setup",
      cta: "View guide",
    },
  },
} as const;

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
};

interface SegmentedControlProps<T extends string> {
  ariaLabel: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  columns?: string;
}

function SegmentedControl<T extends string>({
  ariaLabel,
  value,
  options,
  onChange,
  columns = "grid-cols-2",
}: SegmentedControlProps<T>) {
  return (
    <div className={`grid ${columns} gap-2`} role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left
              transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
              ${
                isActive
                  ? "bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-primary/40 text-primary shadow-sm ring-1 ring-primary/30"
                  : "border-border bg-card/80 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }
            `}
            role="radio"
            aria-checked={isActive}
          >
            {option.icon && (
              <span
                className={`flex-shrink-0 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {option.icon}
              </span>
            )}
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold">{option.label}</span>
              {option.description && (
                <span className="truncate text-[11px] text-muted-foreground">
                  {option.description}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  onSectionChange,
  isMobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const { language, changeLanguage } = useLanguageContext();
  const { theme, resolvedTheme, changeTheme } = useThemeContext();
  const text = copy[language];

  const handleSectionClick = (section: SettingsSection) => {
    onSectionChange(section);
    onCloseMobileMenu?.();
  };

  const cardBase = "bg-card/90 border-r border-border shadow-sm backdrop-blur";

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          w-72 min-w-72 h-screen flex flex-col
          ${cardBase}
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          overflow-y-auto
        `}
        aria-label="Settings Navigation"
      >
        <div className="sticky top-0 bg-card/90 z-10 p-4 border-b border-border backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">{text.title}</h2>
            <button
              onClick={onCloseMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label={text.closeMenu}
            >
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1" role="navigation">
          {navItems.map((section) => {
            const isActive = activeSection === section.id;
            const sectionText = text.sections[section.id];
            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`
                  w-full flex items-start gap-3 px-3 py-3 rounded-lg
                  text-left transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  }
                `}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${section.id}`}
              >
                <div
                  className={`
                    flex-shrink-0 mt-0.5
                    ${isActive ? "text-primary" : "text-muted-foreground"}
                  `}
                >
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">{sectionText.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {sectionText.description}
                  </div>
                </div>
                {isActive && (
                  <div className="flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto p-4 space-y-4 border-t border-border bg-card">
          <div className="bg-primary/5 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-primary">{text.help.title}</span>
            </div>
            <p className="text-xs text-primary/80 mb-2">{text.help.body}</p>
            <button className="w-full px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors">
              {text.help.cta}
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{text.language.title}</p>
                </div>
              </div>
            </div>
            <SegmentedControl<Language>
              ariaLabel={text.language.title}
              value={language}
              options={[
                { value: "en", label: text.language.en },
                { value: "vi", label: text.language.vi },
              ]}
              onChange={changeLanguage}
            />
          </div>

          <button
            onClick={() => changeTheme(resolvedTheme === "light" ? "dark" : "light")}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                {resolvedTheme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </span>
              <div className="flex flex-col">
                <span>{text.theme.title}</span>
              </div>
            </div>
            <span className="rounded-full border border-border bg-card px-2 py-1 text-[11px] font-semibold text-muted-foreground">
              {resolvedTheme === "light" ? text.theme.options.light : text.theme.options.dark}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default React.memo(SettingsSidebar);
