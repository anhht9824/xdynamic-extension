import React from "react";
import { useExtensionContext } from "../../providers/ExtensionProvider";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../providers/ToastProvider";
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
  isGuestMode?: boolean;
}

const FilterGrid: React.FC<FilterGridProps> = ({ 
  filters, 
  onFilterChange,
  isGuestMode = false 
}) => {
  const { isEnabled } = useExtensionContext();
  const { t } = useLanguageContext();
  const { isSignedIn } = useAuth();
  const { showToast } = useToast();

  const handleFilterClick = (key: keyof FilterState, disabled: boolean) => {
    // If guest mode tries to click premium feature
    if (disabled && (isGuestMode || !isSignedIn)) {
      showToast(
        "warning",
        "Tính năng này chỉ dành cho người dùng đã đăng nhập. Vui lòng đăng nhập để sử dụng.",
        4000
      );
      return;
    }
    
    // Normal toggle
    onFilterChange?.(key);
  };

  const filterOptions = [
    {
      key: "sensitive" as const,
      label: t("filter.sensitive", "Nhạy cảm"),
      enabled: filters.sensitive && isEnabled,
      position: "top-0 left-0",
      disabled: false, // Sensitive luôn available, kể cả guest mode
    },
    {
      key: "violence" as const,
      label: t("filter.violence", "Bạo lực"),
      enabled: filters.violence && isEnabled,
      position: "top-0 left-[142px]",
      disabled: !isSignedIn || isGuestMode, // Premium feature
    },
    {
      key: "toxicity" as const,
      label: t("filter.toxicity", "Tiêu cực"),
      enabled: filters.toxicity && isEnabled,
      position: "top-[55px] left-0",
      disabled: !isSignedIn || isGuestMode, // Premium feature
    },
    {
      key: "vice" as const,
      label: t("filter.vice", "Chất kích thích"),
      enabled: filters.vice && isEnabled,
      position: "top-[55px] left-[142px]",
      disabled: !isSignedIn || isGuestMode, // Premium feature
    },
  ];

  return (
    <div className="relative w-[272px] h-[103px]">
      {filterOptions.map(({ key, label, enabled, position, disabled }) => {
        const button = (
          <FilterButton
            label={label}
            isActive={enabled}
            isEnabled={isEnabled}
            disabled={disabled}
            onClick={() => handleFilterClick(key, disabled)}
            multiLine={false} // All buttons should have same layout
          />
        );

        return (
          <div
            key={key}
            className={`absolute w-[130px] h-12 ${position}`}
          >
            {disabled ? (
              <Tooltip 
                content="Tính năng này chỉ dành cho người dùng đã đăng nhập"
                position="top"
              >
                {button}
              </Tooltip>
            ) : (
              button
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FilterGrid;
