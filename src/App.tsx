import { Navigate, Route, Routes } from "react-router-dom";
import { AuthInitializer } from "./components/layout/AuthInitializer";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PublicOnlyRoute } from "./components/layout/PublicOnlyRoute";
import { useAuthStore } from "./store/authStore";
import { AppLayout } from "./components/layout/AppLayout";
import { lazy, Suspense, useEffect } from "react";
import { useThemeStore } from "./store/themeStore";

const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);

const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);

const BoardPage = lazy(() =>
  import("./pages/BoardPage").then((module) => ({ default: module.BoardPage })),
);

const AnalyticsPage = lazy(() =>
  import("./pages/AnalyticsPage").then((module) => ({
    default: module.AnalyticsPage,
  })),
);

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function PageLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );
}

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <AuthInitializer>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/board"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BoardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalyticsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </AuthInitializer>
  );
}

export default App;
