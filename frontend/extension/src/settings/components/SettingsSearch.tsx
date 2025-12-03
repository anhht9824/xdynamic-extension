import React, { useState, useRef, useEffect } from "react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { Language } from "../../types";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  section: string;
  keywords: string[];
}

interface SettingsSearchProps {
  onNavigate: (section: string) => void;
}

const searchIndex: Record<Language, SearchResult[]> = {
  vi: [
    {
      id: "protection-toggle",
      title: "Bảo vệ thời gian thực",
      description: "Bật/tắt tính năng bảo vệ tự động",
      section: "dashboard",
      keywords: ["bảo vệ", "protection", "real-time", "thời gian thực"],
    },
    {
      id: "auto-update",
      title: "Cập nhật tự động",
      description: "Tự động cập nhật quy tắc bảo vệ",
      section: "dashboard",
      keywords: ["cập nhật", "update", "auto", "tự động"],
    },
    {
      id: "change-password",
      title: "Đổi mật khẩu",
      description: "Thay đổi mật khẩu tài khoản",
      section: "account",
      keywords: ["mật khẩu", "password", "đổi"],
    },
    {
      id: "privacy-settings",
      title: "Cài đặt riêng tư",
      description: "Quản lý quyền riêng tư và chia sẻ dữ liệu",
      section: "account",
      keywords: ["riêng tư", "privacy", "dữ liệu"],
    },
    {
      id: "export-data",
      title: "Xuất dữ liệu",
      description: "Xuất cài đặt ra file JSON hoặc CSV",
      section: "advanced",
      keywords: ["xuất", "export", "dữ liệu", "backup"],
    },
    {
      id: "import-data",
      title: "Nhập dữ liệu",
      description: "Nhập cài đặt từ file",
      section: "advanced",
      keywords: ["nhập", "import", "dữ liệu", "restore"],
    },
    {
      id: "security-settings",
      title: "Cài đặt bảo mật",
      description: "Tuỳ chỉnh các quy tắc bảo mật",
      section: "overview",
      keywords: ["bảo mật", "security", "quy tắc"],
    },
    {
      id: "delete-account",
      title: "Xoá tài khoản",
      description: "Xoá vĩnh viễn tài khoản của bạn",
      section: "account",
      keywords: ["xoá", "delete", "account", "tài khoản"],
    },
  ],
  en: [
    {
      id: "protection-toggle",
      title: "Real-time protection",
      description: "Enable or disable automatic blocking",
      section: "dashboard",
      keywords: ["protection", "real-time", "toggle", "security"],
    },
    {
      id: "auto-update",
      title: "Auto update",
      description: "Keep protection rules fresh",
      section: "dashboard",
      keywords: ["auto", "update", "rules", "refresh"],
    },
    {
      id: "change-password",
      title: "Change password",
      description: "Update your account password",
      section: "account",
      keywords: ["password", "change", "security"],
    },
    {
      id: "privacy-settings",
      title: "Privacy settings",
      description: "Control privacy and data sharing",
      section: "account",
      keywords: ["privacy", "data", "sharing"],
    },
    {
      id: "export-data",
      title: "Export data",
      description: "Export settings as JSON or CSV",
      section: "advanced",
      keywords: ["export", "backup", "csv", "json"],
    },
    {
      id: "import-data",
      title: "Import data",
      description: "Restore settings from a file",
      section: "advanced",
      keywords: ["import", "restore", "settings"],
    },
    {
      id: "security-settings",
      title: "Security settings",
      description: "Customize security rules",
      section: "overview",
      keywords: ["security", "rules", "protection"],
    },
    {
      id: "delete-account",
      title: "Delete account",
      description: "Permanently delete your account",
      section: "account",
      keywords: ["delete", "account", "remove"],
    },
  ],
};

const copy: Record<Language, {
  placeholder: string;
  ariaLabel: string;
  clear: string;
  resultsFound: (count: number) => string;
  noResults: (query: string) => string;
  badges: Record<string, string>;
}> = {
  vi: {
    placeholder: "Tìm kiếm cài đặt... (Ctrl+K)",
    ariaLabel: "Tìm kiếm cài đặt",
    clear: "Xoá tìm kiếm",
    resultsFound: (count) => `Tìm thấy ${count} kết quả`,
    noResults: (query) => `Không tìm thấy kết quả cho "${query}"`,
    badges: {
      dashboard: "Trang chủ",
      overview: "Bảo mật",
      account: "Tài khoản",
      advanced: "Nâng cao",
    },
  },
  en: {
    placeholder: "Search settings... (Ctrl+K)",
    ariaLabel: "Search settings",
    clear: "Clear search",
    resultsFound: (count) => `${count} results found`,
    noResults: (query) => `No results for "${query}"`,
    badges: {
      dashboard: "Home",
      overview: "Security",
      account: "Account",
      advanced: "Advanced",
    },
  },
};

const SettingsSearch: React.FC<SettingsSearchProps> = ({ onNavigate }) => {
  const { language } = useLanguageContext();
  const text = copy[language];
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dataSource = searchIndex[language];

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchTerms = query.toLowerCase().split(" ");
    const filtered = dataSource.filter((item) => {
      const searchText = `${item.title} ${item.description} ${item.keywords.join(" ")}`.toLowerCase();
      return searchTerms.every((term) => searchText.includes(term));
    });

    setResults(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query, dataSource]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    onNavigate(result.section);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const highlightMatch = (textValue: string, searchQuery: string) => {
    const terms = searchQuery.toLowerCase().split(" ").filter((t) => t.length > 0);
    let highlighted = textValue;

    terms.forEach((term) => {
      const regex = new RegExp(`(${term})`, "gi");
      highlighted = highlighted.replace(regex, "<mark class='bg-yellow-200 dark:bg-yellow-800 text-gray-900 dark:text-white'>$1</mark>");
    });

    return highlighted;
  };

  const getSectionBadge = (section: string) => {
    const label = text.badges[section] || section;
    const colors: Record<string, string> = {
      dashboard: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      overview: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      account: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      advanced: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };

    return { label, color: colors[section] || "bg-gray-100 text-gray-700" };
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder={text.placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
          aria-label={text.ariaLabel}
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label={text.clear}
          >
            <svg
              className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          role="listbox"
        >
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
              {text.resultsFound(results.length)}
            </p>
          </div>
          <div className="py-1">
            {results.map((result, index) => {
              const badge = getSectionBadge(result.section);
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    isSelected ? "bg-gray-50 dark:bg-gray-700" : ""
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-sm font-medium text-gray-900 dark:text-white"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(result.title, query),
                          }}
                        />
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p
                        className="text-xs text-gray-500 dark:text-gray-400"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(result.description, query),
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isOpen && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {text.noResults(query)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SettingsSearch);
