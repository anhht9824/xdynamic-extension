import React, { useState } from "react";
import { 
  Header, 
  ToggleBar, 
  ContentTypeGrid, 
  FilterGrid, 
  StatsDisplay, 
  ReportButton, 
  BottomBar 
} from "../components";
import { useFilterState, useStats } from "../../hooks";
import { UpgradeBanner } from "../../components/common";

interface MainScreenProps {
  username: string;
  isGuestMode?: boolean;
  onSignOut?: () => void;
  onOpenDashboard?: () => void;
  onOpenLogin?: () => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ 
  username, 
  isGuestMode = false,
  onSignOut, 
  onOpenDashboard,
  onOpenLogin 
}) => {
  const { filters, contentTypes, toggleFilter, toggleContentType } = useFilterState();
  const { blockedCount } = useStats();
  const [showBanner, setShowBanner] = useState(isGuestMode);

  const handleReport = () => {
    if (isGuestMode) {
      // Guest mode cannot access report
      return;
    }
    // Open report page in a new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/report/index.html")
    });
    window.close(); // Close popup
  };

  const handleInfoClick = () => {
    // Open onboarding in a new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/onboarding/index.html")
    });
    // Don't close popup - let user keep it open
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 w-80 h-[460px] relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
      {/* Subtle pattern overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(96,165,250,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.08)_0%,transparent_50%)] pointer-events-none" />

      {/* Header - Logo và Profile badge */}
      <header className="absolute w-72 h-8 top-[19px] left-5 bg-transparent">
        <Header />
      </header>

      {/* Toggle Bar - Switch và URL với status */}
      <div className="absolute w-[297px] h-10 top-[61px] left-3">
        <ToggleBar isDisabled={isGuestMode} />
      </div>

      {/* Content Type Buttons */}
      <div className="absolute top-[111px] left-5 w-[283px] h-[100px]">
        <ContentTypeGrid 
          contentTypes={contentTypes}
          onContentTypeChange={toggleContentType}
        />
      </div>

      {/* Upgrade Banner for Guest Users */}
      {isGuestMode && showBanner && onOpenLogin && (
        <div className="absolute top-[215px] left-4 w-[288px]">
          <UpgradeBanner
            title="Nâng cấp tài khoản"
            message="Đăng nhập để trải nghiệm đầy đủ tính năng"
            features={["Bộ lọc nâng cao", "Báo cáo chi tiết", "Bảo vệ không giới hạn"]}
            onUpgrade={onOpenLogin}
            onDismiss={() => setShowBanner(false)}
            variant="compact"
          />
        </div>
      )}

      {/* Filter Buttons */}
      <div className={`absolute w-[272px] h-[103px] left-6 ${isGuestMode && showBanner ? 'top-[287px]' : 'top-[227px]'}`}>
        <FilterGrid 
          filters={filters}
          onFilterChange={toggleFilter}
          isGuestMode={isGuestMode}
        />
      </div>

      {/* Stats Display */}
      <div className={`absolute w-[313px] left-1 ${isGuestMode && showBanner ? 'top-[402px]' : 'top-[342px]'}`}>
        <StatsDisplay blockedCount={blockedCount} />
      </div>

      {/* Report Button */}
      {!isGuestMode && (
        <div className="absolute w-[313px] h-8 top-[371px] left-1">
          <div className="relative w-24 h-8 left-[108px]">
            <ReportButton onReport={handleReport} />
          </div>
        </div>
      )}

      {/* Login Button for Guest Mode */}
      {isGuestMode && onOpenLogin && (
        <div className={`absolute w-[313px] h-8 left-1 ${showBanner ? 'top-[431px]' : 'top-[371px]'}`}>
          <div className="relative w-48 h-8 left-[82px]">
            <button
              onClick={onOpenLogin}
              className="w-full h-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-2 border-purple-400 rounded-full shadow-md transition-all duration-300"
            >
              <div className="font-bold text-white text-sm tracking-wide leading-5 font-['Sora',Helvetica] text-center whitespace-nowrap">
                Đăng nhập
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="absolute w-72 h-7 top-[413px] left-4">
        <BottomBar 
          username={username} 
          onSignOut={onSignOut}
          isGuestMode={isGuestMode}
          onInfoClick={handleInfoClick}
        />
      </div>
    </div>
  );
};

export default MainScreen;