import React, { useState } from "react";
import DashboardScreen from "./screens/DashboardScreen";
import { useAuth } from "../hooks";
import { redirectToPage } from "../utils";
import { ConfirmationModal } from "../components/common";

const DashboardApp: React.FC = () => {
  const { signOut } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNavigateToReporting = () => {
    // Open reporting flow in new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/report/index.html")
    });
  };

  const handleNavigateToPayment = () => {
    // Open payment flow in new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/payment/index.html")
    });
  };

  const handleNavigateToUpgrade = () => {
    // Open upgrade/billing flow - could be payment flow with upgrade focus
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/payment/index.html?mode=upgrade")
    });
  };

  const handleNavigateToPlanManagement = () => {
    // Open plan management flow in new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/plan/index.html")
    });
  };

  const handleNavigateToSettings = () => {
    // Open settings flow in new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/settings/index.html")
    });
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    signOut();
    setShowLogoutConfirm(false);
    // Redirect to login or onboarding
    redirectToPage('LOGIN');
  };

  return (
    <>
      <DashboardScreen
        onNavigateToReporting={handleNavigateToReporting}
        onNavigateToPayment={handleNavigateToPayment}
        onNavigateToUpgrade={handleNavigateToUpgrade}
        onNavigateToPlanManagement={handleNavigateToPlanManagement}
        onNavigateToSettings={handleNavigateToSettings}
        onLogout={handleLogout}
      />

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc muốn đăng xuất khỏi tài khoản?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        variant="default"
      />
    </>
  );
};

export default DashboardApp;