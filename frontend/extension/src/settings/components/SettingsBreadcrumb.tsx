import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface SettingsBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const SettingsBreadcrumb: React.FC<SettingsBreadcrumbProps> = ({
  items,
  className = "",
}) => {
  return (
    <nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
            {isLast ? (
              <span
                className="font-medium text-gray-900 dark:text-white"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default React.memo(SettingsBreadcrumb);
