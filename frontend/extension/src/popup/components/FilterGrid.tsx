import React from "react";
import { useExtensionContext } from "../../providers/ExtensionProvider";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useToast } from "../../providers/ToastProvider";
import { PlanType } from "../../types/common";
import FilterButton from "./FilterButton";
import { Tooltip } from "../../components/ui";

interface FilterState {
  sensitive: boolean;
  violence: boolean;
  toxicity: boolean;
  vice: boolean;
}

interface FilterGridProps {
  filters: FilterState;
  onFilterChange?: (filterName: keyof FilterState) => void;
  planAccess?: PlanType;
  onRequireAuth?: () => void;
}

const FilterGrid: React.FC<FilterGridProps> = ({
  filters,
  onFilterChange,
  planAccess = "free",
  onRequireAuth,
}) => {
  const { isEnabled } = useExtensionContext();
  const { t } = useLanguageContext();
  const { showToast } = useToast();
  const isFreePlan = planAccess === "free";

  const handleFilterClick = (key: keyof FilterState, disabled: boolean) => {
    if (disabled) {
      showToast(
        "warning",
        "Bộ lọc nâng cao chỉ khả dụng khi bạn đăng nhập và nâng cấp gói.",
        4000
      );
      onRequireAuth?.();
      return;
    }

    onFilterChange?.(key);
  };

  const filterOptions = [
    {
      key: "sensitive" as const,
      label: t("filter.sensitive", "Nhạy cảm"),
      enabled: filters.sensitive && isEnabled,
      disabled: false,
    },
    {
      key: "violence" as const,
      label: t("filter.violence", "Máu me"),
      enabled: filters.violence && isEnabled,
      disabled: isFreePlan,
    },
    {
      key: "toxicity" as const,
      label: t("filter.toxicity", "Vũ khí"),
      enabled: filters.toxicity && isEnabled,
      disabled: isFreePlan,
    },
    {
      key: "vice" as const,
      label: t("filter.vice", "Chiến tranh"),
      enabled: filters.vice && isEnabled,
      disabled: isFreePlan,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {filterOptions.map(({ key, label, enabled, disabled }) => {
        const button = (
          <FilterButton
            label={label}
            isActive={enabled}
            isEnabled={isEnabled}
            disabled={disabled}
            onClick={() => handleFilterClick(key, disabled)}
            multiLine={false}
          />
        );

        return disabled ? (
          <Tooltip
            key={key}
            content="Nâng cấp hoặc đăng nhập để bật bộ lọc này"
            position="top"
          >
            {button}
          </Tooltip>
        ) : (
          <div key={key}>{button}</div>
        );
      })}
    </div>
  );
};

export default FilterGrid;
