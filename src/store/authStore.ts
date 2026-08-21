import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../types";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setInitialized: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitializing: true,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setAccessToken: (accessToken) =>
        set({ accessToken, isAuthenticated: true }),
      setInitialized: () => set({ isInitializing: false }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "sprintdesk-auth",
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
        // deliberately NOT persisting accessToken — memory only, per spec
      }),
    },
  ),
);
