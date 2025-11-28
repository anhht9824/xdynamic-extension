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
      return;
    }

    chrome.tabs.create({ url: "https://xdynamic.com/report" });
  };

  return (
    <button
      className="px-8 py-2.5 bg-[#0056b3] hover:bg-[#004494] text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95"
      onClick={handleReport}
    >
      <div className="font-bold text-base tracking-wide leading-none font-['Sora',Helvetica] text-center whitespace-nowrap">
        {t("report.button", "Báo cáo")}
      </div>
    </button>
  );
};

export default ReportButton;
