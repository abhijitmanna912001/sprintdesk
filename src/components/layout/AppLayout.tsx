import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNotificationPolling } from "../../hooks/useNotificationPolling";
import { useState } from "react";
import { useNotificationStore } from "../../store/notificationStore";
import { NotificationPanel } from "../notifications/NotificationPanel";
import { ToastContainer } from "../ui/ToastContainer";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: Readonly<AppLayoutProps>) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useNotificationPolling();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "font-semibold underline" : "text-gray-600";

  const notificationLabel =
    unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications";

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
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
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPanelOpen((prev) => !prev)}
              aria-label={notificationLabel}
              className="relative text-gray-600 hover:text-gray-900"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isPanelOpen && (
              <NotificationPanel onClose={() => setIsPanelOpen(false)} />
            )}
          </div>

          {user && (
            <span className="text-sm text-gray-600">{user.username}</span>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="flex-1">{children}</main>
      <ToastContainer />
    </div>
  );
}
