import { Navigate, Route, Routes } from "react-router-dom";
import { AuthInitializer } from "./components/layout/AuthInitializer";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PublicOnlyRoute } from "./components/layout/PublicOnlyRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { BoardPage } from "./pages/BoardPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { useAuthStore } from "./store/authStore";
import { AppLayout } from "./components/layout/AppLayout";

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <AuthInitializer>
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
    </AuthInitializer>
  );
}

export default App;
