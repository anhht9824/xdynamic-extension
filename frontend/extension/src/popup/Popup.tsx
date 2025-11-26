import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import MainScreen from "./screens/MainScreen";
import LoadingScreen from "./screens/LoadingScreen";
import { LoginModal, RegisterModal } from "./components";
import { STORAGE_KEYS } from "../utils";

const Popup: React.FC = () => {
  const { isSignedIn, user, isFirstTime, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);

  // Check if user wants guest mode
  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEYS.GUEST_MODE], (result) => {
      if (result[STORAGE_KEYS.GUEST_MODE]) {
        setIsGuestMode(true);
      }
    });
  }, []);

  const handleOpenOnboarding = () => {
    setShowRegisterModal(true);
  };

  const handleOpenLogin = () => {
    setShowLoginModal(true);
  };

  const handleUseAsGuest = () => {
    // Save guest mode preference
    chrome.storage.local.set({ [STORAGE_KEYS.GUEST_MODE]: true });
    setIsGuestMode(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setIsGuestMode(false);
    chrome.storage.local.remove(STORAGE_KEYS.GUEST_MODE);
    // Force refresh to update auth state
    setForceRefresh(prev => prev + 1);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setIsGuestMode(false);
    chrome.storage.local.remove(STORAGE_KEYS.GUEST_MODE);
    // Force refresh to update auth state
    setForceRefresh(prev => prev + 1);
  };

  const handleOpenDashboard = () => {
    // Open dashboard page in a new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/dashboard/index.html")
    });
    window.close(); // Close popup
  };

  const handleSignOut = () => {
    // Sign out and clear all auth-related storage
    signOut();
    chrome.storage.local.remove([STORAGE_KEYS.GUEST_MODE], () => {
      setIsGuestMode(false);
      setForceRefresh(prev => prev + 1);
    });
  };

  // Show loading if needed
  if (isSignedIn === undefined && !isGuestMode) {
    return (
      <div className="w-80 h-[460px] flex flex-col bg-gray-50">
        <LoadingScreen />
      </div>
    );
  }

  // If user is not signed in and not in guest mode, show welcome options
  if (!isSignedIn && !isGuestMode) {
    return (
      <div className="w-80 h-[460px] flex flex-col bg-gray-50 items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-4">
            <svg 
              className="w-16 h-16 mx-auto text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Chào mừng đến với XDynamic
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Đăng nhập để truy cập đầy đủ tính năng hoặc dùng thử chế độ khách
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleOpenLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Đăng nhập
            </button>
            
            <button
              onClick={handleOpenOnboarding}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Đăng ký tài khoản mới
            </button>

            <button
              onClick={handleUseAsGuest}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Dùng thử chế độ khách
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Chế độ khách chỉ cho phép sử dụng bộ lọc cơ bản
          </p>
        </div>
      </div>
    );
  }

  // Show main popup for authenticated users or guest mode
  return (
    <>
      <div className="w-80 h-[460px] flex flex-col bg-gray-50">
        <MainScreen
          username={user?.fullName || "Khách"}
          isGuestMode={isGuestMode}
          onSignOut={handleSignOut}
          onOpenDashboard={handleOpenDashboard}
          onOpenLogin={handleOpenLogin}
        />
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </>
  );
};

export default Popup;
