import React from "react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { formatNumber } from "../../lib/utils";

interface StatsDisplayProps {
  blockedCount: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ blockedCount }) => {
  const { t } = useLanguageContext();
  
  // Fixed text: "Đang chặn" + "phương trình độc hại" (corrected from "phụng trình")
  const statsText = t("stats.blocking", `Đang chặn ${formatNumber(blockedCount)} phương trình độc hại`)
    .replace("{count}", formatNumber(blockedCount));

  return (
    <div className="w-[313px] font-['Sora',Helvetica] font-semibold text-orange-600 text-sm text-center tracking-[-0.01em] leading-tight">
      {statsText}
    </div>
  );
};

export default StatsDisplay;
