import React, { useState } from "react";
import { UserProfile, SettingsTab } from "../../types/common";
import { ConfirmationModal } from "../../components/common";

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditProfile: () => void;
  onLogout: () => void;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditProfile,
  onLogout,
  activeTab,
  onTabChange,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const getPlanBadgeColor = (planType: string) => {
    switch (planType) {
      case "pro":
        return "bg-gradient-to-r from-purple-500 to-purple-700 text-white";
      case "plus":
        return "bg-gradient-to-r from-blue-500 to-blue-700 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: string }[] = [
    { id: "overview", label: "Tổng quan", icon: "📊" },
    { id: "advanced", label: "Nâng cao", icon: "⚙️" },
    { id: "account", label: "Tài khoản", icon: "👤" },
  ];

  return (
    <>
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-lg">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={onEditProfile}
                className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Chỉnh sửa avatar"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            {/* User Info */}
            <div className="text-white text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold">{profile.fullName}</h2>
                <button
                  onClick={onEditProfile}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  aria-label="Chỉnh sửa hồ sơ"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <p className="text-blue-100 mb-2 text-sm sm:text-base break-all sm:break-normal">{profile.email}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPlanBadgeColor(profile.planType)}`}>
                {profile.plan}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button
              onClick={onEditProfile}
              className="w-full sm:w-auto px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Cài đặt</span>
            </button>
            <button
              onClick={handleLogoutClick}
              className="w-full sm:w-auto px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-sm sm:text-base transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-base sm:text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

    <ConfirmationModal
      isOpen={showLogoutConfirm}
      title="Xác nhận đăng xuất"
      message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"
      confirmText="Đăng xuất"
      cancelText="Hủy"
      onConfirm={handleLogoutConfirm}
      onCancel={() => setShowLogoutConfirm(false)}
      variant="destructive"
    />
    </>
  );
};

export default React.memo(ProfileHeader);
