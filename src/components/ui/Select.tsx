import type { SelectHTMLAttributes, ReactNode } from "react";
import { useId } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function Select({
  label,
  className = "",
  id,
  children,
  ...rest
}: Readonly<SelectProps>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div>
      <label
        htmlFor={selectId}
        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
