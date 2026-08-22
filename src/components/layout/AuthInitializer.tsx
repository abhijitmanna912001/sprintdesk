import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { refreshRequest } from "../../api/auth";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: Readonly<AuthInitializerProps>) {
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    async function restoreSession() {
      if (!refreshToken) {
        setInitialized();
        return;
      }
      try {
        const { data } = await refreshRequest(refreshToken);
        setAccessToken(data.accessToken);
      } catch {
        logout();
      } finally {
        setInitialized();
      }
    }

    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run once on mount to validate session; refreshToken is read from store at mount time only
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading SprintDesk...</p>
      </div>
    );
  }

  return <>{children}</>;
}
