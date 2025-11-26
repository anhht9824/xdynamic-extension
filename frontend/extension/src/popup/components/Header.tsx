import React, { useState } from "react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useAuth } from "../../hooks/useAuth";
import LogoIcon from "../../components/icons/HeaderLogo";
import { Settings, LogOut } from "lucide-react";

const Header: React.FC = () => {
  const { t } = useLanguageContext();
  const { isSignedIn, signIn, signOut, user } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Create a basic user object for login
      const user = {
        email: `${username.trim()}@example.com`, // Temporary email
        fullName: username.trim(),
      };
      signIn(user);
      setShowLoginForm(false);
      setUsername("");
    }
  };

  const handleLogout = () => {
    signOut();
  };

  const handleOpenSettings = () => {
    // Open settings/dashboard page in a new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/settings/index.html")
    });
    window.close();
  };

  const LoginOverlay = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl w-80 mx-4">
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="text-lg font-semibold text-gray-800 text-center">
            {t("auth.signIn", "Đăng nhập")}
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("auth.namePlaceholder", "Nhập tên của bạn")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t("auth.signIn", "Đăng nhập")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLoginForm(false);
                setUsername("");
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {t("common.cancel", "Hủy")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Logo on the left */}
      <div className="absolute w-[118px] h-8 top-0 left-0">
        <LogoIcon className="w-[118px] h-8" />
      </div>

      {/* Auth buttons on the right */}
      {isSignedIn ? (
        // Logged in: Show Profile (Settings) and Logout buttons
        <div className="flex items-center gap-2 absolute top-0 right-0 h-8">
          {/* Profile/Settings Button */}
          <button
            onClick={handleOpenSettings}
            className="flex items-center justify-center w-8 h-6 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-gray-300 shadow-md hover:bg-white hover:border-blue-400 transition-all"
            title={t("settings.title", "Cài đặt")}
          >
            <Settings className="w-4 h-4 text-gray-700" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-8 h-6 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-gray-300 shadow-md hover:bg-white hover:border-red-400 transition-all"
            title={t("auth.signOut", "Đăng xuất")}
          >
            <LogOut className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      ) : (
        // Not logged in: Show Login button
        <div className="flex w-[71px] h-6 absolute top-1 right-0">
          <div className="relative w-[73px] h-[26px] -top-px -left-px bg-white/80 backdrop-blur-sm rounded-lg border-2 border-gray-300 shadow-md cursor-pointer hover:bg-white hover:border-gray-400 transition-all">
            <button
              onClick={() => setShowLoginForm(true)}
              className="absolute w-[61px] h-4 top-0.5 left-1 font-['Sora',Helvetica] font-bold text-gray-700 text-[10px] text-center tracking-[0.10px] leading-5 whitespace-nowrap"
            >
              {t("auth.signIn", "Đăng nhập")}
            </button>
          </div>
        </div>
      )}

      {showLoginForm && <LoginOverlay />}
    </>
  );
};

export default Header;
