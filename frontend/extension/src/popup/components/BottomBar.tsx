import React, { useState, useRef } from "react";
import { Info, ChevronDown } from "lucide-react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useClickOutside } from "../../hooks";

interface BottomBarProps {
  username: string;
  onSignOut?: () => void;
  isGuestMode?: boolean;
  onInfoClick?: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ 
  username, 
  onSignOut,
  isGuestMode = false,
  onInfoClick
}) => {
  const { t, language, changeLanguage, availableLanguages } =
    useLanguageContext();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => {
    if (showLanguageDropdown) {
      setShowLanguageDropdown(false);
    }
  });

  const handleInfoClick = () => {
    if (onInfoClick) {
      onInfoClick();
    } else {
      // Default behavior: Open onboarding
      chrome.tabs.create({
        url: chrome.runtime.getURL("src/onboarding/index.html")
      });
    }
  };

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode as any);
    setShowLanguageDropdown(false);
  };

  // Handle keyboard navigation in dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowLanguageDropdown(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowLanguageDropdown(!showLanguageDropdown);
    }
  };

  return (
    <>
      {/* Info Icon - Always Clickable */}
      <button
        className="absolute w-5 h-5 top-1 left-2.5 z-10"
        onClick={handleInfoClick}
        title={t("info.help", "Trợ giúp")}
        aria-label={t("info.help", "Trợ giúp")}
      >
        <Info className="w-5 h-5 text-blue-500 hover:text-blue-600 transition-colors cursor-pointer" />
      </button>

      {/* Language Dropdown - Centered */}
      <div 
        ref={dropdownRef}
        className="flex w-[60px] h-7 items-center justify-center gap-2.5 px-0 py-[3px] absolute top-0 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-[10px] border-2 border-solid border-gray-300 shadow-md z-10"
      >
        <button
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          onKeyDown={handleKeyDown}
          className="relative w-full h-[26px] mt-[-2.00px] mb-[-2.00px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
          aria-label={t("settings.language", "Ngôn ngữ")}
          aria-expanded={showLanguageDropdown}
          aria-haspopup="true"
        >
          <div className="flex w-full h-[26px] items-center justify-center px-[5px] py-0 relative">
            <span className="font-['Sora',Helvetica] font-semibold text-gray-700 text-[11px] text-center tracking-[0.10px] leading-5 whitespace-nowrap">
              {language === "vi" ? "VI" : "EN"}
            </span>
            <ChevronDown className="w-3 h-3 ml-0.5 text-gray-600" />
          </div>
        </button>

        {/* Language Dropdown Menu - Fixed Positioning */}
        {showLanguageDropdown && (
          <div 
            className="fixed bg-white rounded-lg shadow-2xl py-1 min-w-[140px] border border-gray-200"
            style={{
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999
            }}
          >
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${
                  language === lang.code 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-700 font-medium"
                }`}
              >
                <span>{lang.name}</span>
                {language === lang.code && (
                  <span className="text-blue-600 text-lg">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Username Display - Only show if NOT guest mode */}
      {!isGuestMode && (
        <div className="absolute right-2.5 top-1 flex items-center gap-1">
          <span className="font-['Sora',Helvetica] font-medium text-gray-700 text-[10px] tracking-[0.10px] leading-5 whitespace-nowrap max-w-[80px] overflow-hidden text-ellipsis">
            {username}
          </span>
        </div>
      )}
    </>
  );
};

export default BottomBar;
