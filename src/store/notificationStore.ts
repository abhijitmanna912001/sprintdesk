import { create } from "zustand";
import type { Notification } from "../types";
import { persist } from "zustand/middleware";

interface NotificationState {
  notifications: Notification[];
  addNotifications: (newOnes: Notification[]) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],

      addNotifications: (newOnes) =>
        set((state) => ({
          notifications: [...newOnes, ...state.notifications],
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    {
      name: "sprintdesk-notifications",
    },
  ),
);
