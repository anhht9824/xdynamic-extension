import React, { useState, useEffect } from 'react';

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  validate?: (value: string) => string | null;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  className?: string;
}

/**
 * FormInput - Enhanced input field with real-time validation and visual feedback
 * 
 * Features:
 * - Real-time validation with visual feedback
 * - Success/error states with icons
 * - Smooth transition animations
 * - Optional icon support
 * - Hint text support
 * - Accessible labels
 * 
 * @example
 * <FormInput
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={setEmail}
 *   validate={(val) => !val.includes('@') ? 'Invalid email' : null}
 * />
 */
const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error: externalError,
  success: externalSuccess,
  hint,
  icon,
  validate,
  validateOnBlur = true,
  validateOnChange = false,
  className = '',
}) => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const error = externalError || internalError;
  const success = externalSuccess && !error;

  // Validation on change
  useEffect(() => {
    if (validateOnChange && touched && validate) {
      const validationError = validate(value);
      setInternalError(validationError);
    }
  }, [value, validateOnChange, touched, validate]);

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);

    if (validateOnBlur && validate) {
      const validationError = validate(value);
      setInternalError(validationError);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-2.5 rounded-lg
            border-2 transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${
              error
                ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                : success
                ? 'border-green-500 focus:border-green-600 focus:ring-2 focus:ring-green-200'
                : isFocused
                ? 'border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-200'
                : 'border-gray-300 dark:border-gray-600'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
            text-gray-900 dark:text-white
            placeholder:text-gray-400
            focus:outline-none
            disabled:opacity-60
          `}
        />

        {/* Status Icons */}
        {(error || success) && (
          <div
            className={`
              absolute right-3 top-1/2 -translate-y-1/2
              transition-all duration-200
              ${error ? 'text-red-500' : 'text-green-500'}
            `}
          >
            {error ? (
              // Error Icon
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Success Icon
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Error/Success/Hint Messages */}
      <div className="min-h-[20px]">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 animate-slide-down">
            {error}
          </p>
        )}
        {success && !error && (
          <p className="text-sm text-green-600 dark:text-green-400 animate-slide-down">
            {success}
          </p>
        )}
        {!error && !success && hint && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{hint}</p>
        )}
      </div>
    </div>
  );
};

export default FormInput;
