import React, { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full p-3 border rounded-lg bg-gray-50 placeholder-gray-400 transition-colors ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-200 focus:border-blue-500"
        } focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-gray-500 text-xs mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default FormInput;