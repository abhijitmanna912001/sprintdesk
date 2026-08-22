import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-900",
  secondary:
    "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-900",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: Readonly<ButtonProps>) {
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded font-medium transition-colors disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
