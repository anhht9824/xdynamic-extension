import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import MainScreen from "./screens/MainScreen";
import LoadingScreen from "./screens/LoadingScreen";
import { LoginModal, RegisterModal } from "./components";
import { STORAGE_KEYS } from "../utils";
import { PlanType } from "../types/common";

const Popup: React.FC = () => {
  const { isSignedIn, user, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEYS.GUEST_MODE], (result) => {
      if (result[STORAGE_KEYS.GUEST_MODE]) {
        setIsGuestMode(true);
      }
    });
  }, []);

  const handleOpenLogin = () => setShowLoginModal(true);
  const handleOpenRegister = () => setShowRegisterModal(true);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsGuestMode(false);
    chrome.storage.local.remove(STORAGE_KEYS.GUEST_MODE);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setIsGuestMode(false);
    chrome.storage.local.remove(STORAGE_KEYS.GUEST_MODE);
  };

  const handleOpenDashboard = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/dashboard/index.html"),
    });
    window.close();
  };

  const handleSignOut = () => {
    signOut();
    chrome.storage.local.remove([STORAGE_KEYS.GUEST_MODE], () => {
      setIsGuestMode(false);
    });
  };

  const effectiveUsername = user?.fullName || "Khách";
  const effectivePlan: PlanType | undefined = (user as any)?.planType;

  if (isSignedIn === undefined && !isGuestMode) {
    return (
      <div className="w-80 h-[460px] flex flex-col bg-gray-50">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <>
      <div className="w-80 h-[460px] flex flex-col bg-white">
        <MainScreen
          username={effectiveUsername}
          planType={effectivePlan}
          isGuestMode={!isSignedIn || isGuestMode}
          onSignOut={handleSignOut}
          onOpenDashboard={handleOpenDashboard}
          onOpenLogin={handleOpenLogin}
        />
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            handleOpenRegister();
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            handleOpenLogin();
          }}
        />
      )}
    </>
  );
};

export default Popup;
