import React, { useEffect, useMemo } from "react";
import {
  Header,
  ToggleBar,
  ContentTypeGrid,
  FilterGrid,
  StatsDisplay,
  ReportButton,
  BottomBar,
} from "../components";
import { useAuth, useFilterState, useStats } from "../../hooks";
import { PlanType } from "../../types/common";

interface MainScreenProps {
  username: string;
  planType?: PlanType;
  isGuestMode?: boolean;
  onSignOut?: () => void;
  onOpenDashboard?: () => void;
  onOpenLogin?: () => void;
}

const derivePlanType = (
  planType: PlanType | string | undefined,
  isSignedIn: boolean,
  isGuestMode: boolean
): PlanType => {
  if (!isSignedIn || isGuestMode) return "free";
  if (planType === "free" || planType === "plus" || planType === "pro") {
    return planType;
  }
  if (planType === "premium" || planType === "premium_plus" || planType === "enterprise") {
    return "pro";
  }
  return "pro";
};

const MainScreen: React.FC<MainScreenProps> = ({
  username,
  planType,
  isGuestMode = false,
  onSignOut,
  onOpenDashboard,
  onOpenLogin,
}) => {
  const { filters, contentTypes, toggleFilter, toggleContentType, setFilters } = useFilterState();
  const { blockedCount } = useStats();
  const { isSignedIn, user } = useAuth();

  const effectivePlan: PlanType = useMemo(
    () => derivePlanType(planType ?? (user as any)?.planType, isSignedIn, isGuestMode),
    [isSignedIn, isGuestMode, planType, user]
  );

  useEffect(() => {
    if (effectivePlan === "free") {
      setFilters((prev) => ({
        ...prev,
        violence: false,
        toxicity: false,
        vice: false,
      }));
    }
  }, [effectivePlan, setFilters]);

  const handleReport = () => {
    if (!isSignedIn) {
      onOpenLogin?.();
      return;
    }
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/report/index.html"),
    });
    window.close();
  };

  const handleInfoClick = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/onboarding/index.html"),
    });
  };

  return (
    <div className="w-80 h-[460px] bg-white border border-gray-200 rounded-3xl shadow-lg flex flex-col px-4 py-3 gap-3">
      <Header onLoginClick={onOpenLogin} onProfileClick={onOpenDashboard} />

      <ToggleBar />

      <ContentTypeGrid contentTypes={contentTypes} onContentTypeChange={toggleContentType} />

      <FilterGrid
        filters={filters}
        onFilterChange={toggleFilter}
        planAccess={effectivePlan}
        onRequireAuth={onOpenLogin}
      />

      <StatsDisplay blockedCount={blockedCount} />

      <div className="flex justify-center">
        <ReportButton onReport={handleReport} />
      </div>

      <div className="mt-auto">
        <BottomBar
          username={isSignedIn ? username : ""}
          onSignOut={onSignOut}
          isGuestMode={!isSignedIn}
          onInfoClick={handleInfoClick}
        />
      </div>
    </div>
  );
};

export default MainScreen;
