import React from "react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useAuth } from "../../hooks/useAuth";
import LogoIcon from "../../components/icons/HeaderLogo";
import { ProfileIcon } from "../../components/icons/ProfileIcon";
import { SigninIcon } from "../../components/icons/SigninIcon";
import { LogoutIcon } from "../../components/icons/LogoutIcon";

interface HeaderProps {
  onLoginClick?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onProfileClick }) => {
  const { t } = useLanguageContext();
  const { isSignedIn, signOut } = useAuth();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleProfile = () => {
    if (onProfileClick) {
      onProfileClick();
      return;
    }

    chrome.tabs.create({
      url: chrome.runtime.getURL("src/settings/index.html"),
    });
    window.close();
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="flex items-center justify-between w-full">
      <LogoIcon className="w-[118px] h-8" />

      {isSignedIn ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleProfile}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="border-none bg-transparent p-0 cursor-pointer"
          >
            <ProfileIcon variant={isHovered ? "active" : "default"} />
          </button>
          <button
            onClick={handleLogout}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            title={t("auth.logout", "Đăng xuất")}
          >
            <LogoutIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={onLoginClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="border-none bg-transparent p-0 cursor-pointer"
        >
          <SigninIcon variant={isHovered ? "active" : "default"} />
        </button>
      )}
    </div>
  );
};

export default Header;
