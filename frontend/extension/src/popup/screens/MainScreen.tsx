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
  planType?: PlanType;
  isGuestMode?: boolean;
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
  planType,
  isGuestMode = false,
  onOpenDashboard,
  onOpenLogin,
}) => {
  const { filters, contentTypes, toggleFilter, toggleContentType, setFilters } = useFilterState();
  const { todayBlocked } = useStats();
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
    <div className="w-full h-full bg-white border border-gray-200 rounded-[24px] shadow-lg flex flex-col px-4 py-3 gap-3 overflow-hidden">
      <Header onLoginClick={onOpenLogin} onProfileClick={onOpenDashboard} />

      <ToggleBar />

      <ContentTypeGrid contentTypes={contentTypes} onContentTypeChange={toggleContentType} />

      <FilterGrid
        filters={filters}
        onFilterChange={toggleFilter}
        planAccess={effectivePlan}
        onRequireAuth={onOpenLogin}
      />

      <StatsDisplay blockedCount={todayBlocked} />

      <div className="flex justify-center">
        <ReportButton onReport={handleReport} />
      </div>

      <div className="mt-auto">
        <BottomBar
          onInfoClick={handleInfoClick}
        />
      </div>
    </div>
  );
};

export default MainScreen;
