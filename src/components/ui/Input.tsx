import type { InputHTMLAttributes } from "react";
import { useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...rest
}: Readonly<InputProps>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
          error
            ? "border-red-500 dark:border-red-500"
            : "border-gray-300 dark:border-gray-600"
        } ${className}`}
        {...rest}
      />
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
