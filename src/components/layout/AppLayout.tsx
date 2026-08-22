import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNotificationPolling } from "../../hooks/useNotificationPolling";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: Readonly<AppLayoutProps>) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  useNotificationPolling();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "font-semibold underline" : "text-gray-600";

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
    </div>
  );
}
