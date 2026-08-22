import { NavLink, useNavigate } from "react-router-dom";
import { useNotificationPolling } from "../../hooks/useNotificationPolling";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { NotificationPanel } from "../notifications/NotificationPanel";
import { ToastContainer } from "../ui/ToastContainer";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: Readonly<AppLayoutProps>) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const isPanelOpen = useNotificationStore((state) => state.isPanelOpen);
  const setPanelOpen = useNotificationStore((state) => state.setPanelOpen);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useNotificationPolling();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "font-semibold underline dark:text-white"
      : "text-gray-600 dark:text-gray-400";

  const notificationLabel =
    unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications";

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <nav className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex gap-6">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/board" className={linkClass}>
            Board
          </NavLink>
          <NavLink to="/analytics" className={linkClass}>
            Analytics
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              type="button"
              onClick={() => setPanelOpen(!isPanelOpen)}
              aria-label={notificationLabel}
              className="relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isPanelOpen && (
              <NotificationPanel onClose={() => setPanelOpen(false)} />
            )}
          </div>

          {user && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user.username}
            </span>
          )}

          <Button
            variant="secondary"
            onClick={handleLogout}
            className="text-sm px-3 py-1.5"
          >
            Logout
          </Button>
        </div>
      </nav>

      <main className="flex-1">{children}</main>
      <ToastContainer />
    </div>
  );
}
