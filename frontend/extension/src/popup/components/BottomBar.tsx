import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import InfoIcon from "../../components/icons/InfoIcon";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useClickOutside } from "../../hooks";

interface BottomBarProps {
  onInfoClick?: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  onInfoClick,
}) => {
  const { t, language, changeLanguage, availableLanguages } = useLanguageContext();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    if (showLanguageDropdown) {
      setShowLanguageDropdown(false);
    }
  });

  const handleInfoClick = () => {
    if (onInfoClick) {
      onInfoClick();
      return;
    }
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/onboarding/index.html"),
    });
  };

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode as any);
    setShowLanguageDropdown(false);
  };

  return (
    <div className="flex items-center justify-between w-full">
      <button
        className="border-none bg-transparent p-0 cursor-pointer"
        onClick={handleInfoClick}
        onMouseEnter={() => setIsInfoHovered(true)}
        onMouseLeave={() => setIsInfoHovered(false)}
        title={t("info.help", "Trợ giúp")}
        aria-label={t("info.help", "Trợ giúp")}
      >
        <InfoIcon variant={isInfoHovered ? "active" : "default"} />
      </button>

      <div
        ref={dropdownRef}
        className="relative"
      >
        <button
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className="h-8 px-4 bg-white rounded-[10px] shadow-sm border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          aria-label={t("settings.language", "Ngôn ngữ")}
          aria-expanded={showLanguageDropdown}
          aria-haspopup="true"
        >
          <span className="text-sm font-medium text-blue-600">
            {language === 'vi' ? 'Tiếng Việt' : 'English'}
          </span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>

        {showLanguageDropdown && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-2xl py-1 min-w-[160px] border border-gray-200 z-50">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${
                  language === lang.code
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 font-medium"
                }`}
              >
                <span>{lang.name}</span>
                {language === lang.code && (
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none"
                    className="text-blue-600"
                  >
                    <path 
                      d="M13 4L6 11L3 8" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default BottomBar;
