import { useThemeStore } from "../../store/themeStore";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
