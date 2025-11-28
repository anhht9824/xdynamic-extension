import React from "react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { formatNumber } from "../../lib/utils";

interface StatsDisplayProps {
  blockedCount: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ blockedCount }) => {
  const { t } = useLanguageContext();
  const statsText = t(
    "stats.blocking",
    `Đã chặn được ${formatNumber(blockedCount)} phương tiện độc hại`
  ).replace("{count}", formatNumber(blockedCount));

  return (
    <div className="w-full font-['Sora',Helvetica] font-semibold text-orange-600 text-sm text-center tracking-[-0.01em] leading-tight">
      {statsText}
    </div>
  );
};

export default StatsDisplay;
