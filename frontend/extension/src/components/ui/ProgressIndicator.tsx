import React from "react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-colors ${
            index < currentStep
              ? "bg-blue-500"
              : index === currentStep
              ? "bg-blue-300"
              : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;