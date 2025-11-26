import React, { useState } from 'react';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  mainIcon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * FloatingActionButton (FAB) - Floating button with expandable actions
 * 
 * Features:
 * - Main button with click-to-expand
 * - Multiple action buttons
 * - Smooth expand/collapse animations
 * - Configurable position
 * - Backdrop overlay
 * 
 * @example
 * <FloatingActionButton
 *   actions={[
 *     { icon: <SaveIcon />, label: 'Save', onClick: handleSave },
 *     { icon: <ExportIcon />, label: 'Export', onClick: handleExport },
 *   ]}
 * />
 */
const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions = [],
  mainIcon,
  position = 'bottom-right',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleActionClick = (action: FABAction) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        {/* Action Buttons */}
        {isOpen && (
          <div className="absolute bottom-full mb-4 right-0 space-y-3 animate-slide-up">
            {actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 animate-slide-in-right"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Label */}
                <span className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  {action.label}
                </span>

                {/* Action Button */}
                <button
                  onClick={() => handleActionClick(action)}
                  className={`
                    ${sizeClasses.md}
                    rounded-full shadow-lg
                    ${action.color || 'bg-blue-500 hover:bg-blue-600'}
                    text-white
                    flex items-center justify-center
                    transition-transform duration-200
                    hover:scale-110
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  `}
                >
                  {action.icon}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={toggleOpen}
          className={`
            ${sizeClasses[size]}
            rounded-full
            bg-gradient-to-r from-blue-600 to-blue-700
            hover:from-blue-700 hover:to-blue-800
            text-white
            shadow-2xl
            flex items-center justify-center
            transition-all duration-300
            ${isOpen ? 'rotate-45 scale-110' : 'rotate-0 scale-100'}
            focus:outline-none focus:ring-4 focus:ring-blue-300
            hover:shadow-blue-500/50
          `}
        >
          {mainIcon || (
            <svg
              className={iconSizeClasses[size]}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

export default FloatingActionButton;
