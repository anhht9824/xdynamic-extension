import React from "react";
import { useLanguageContext } from "../../providers/LanguageProvider";

interface ReportButtonProps {
  onReport?: () => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({ onReport }) => {
  const { t } = useLanguageContext();

  const handleReport = () => {
    if (onReport) {
      onReport();
    } else {
      // Default report action
      chrome.tabs.create({ url: "https://xdynamic.com/report" });
    }
  };

  return (
    <button
      className="w-[98px] h-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-2 border-blue-400 rounded-full shadow-md transition-all duration-300"
      onClick={handleReport}
    >
      <div className="font-bold text-white text-sm tracking-wide leading-5 font-['Sora',Helvetica] text-center whitespace-nowrap">
        {t("report.button", "Báo cáo")}
      </div>
    </button>
  );
};

export default ReportButton;
