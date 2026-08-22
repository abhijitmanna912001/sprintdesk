import { useEffect, useRef } from "react";
import { useNotificationStore } from "../store/notificationStore";
import { fetchNotificationPosts } from "../api/notifications";
import { useToastStore } from "../store/toastStore";

const POLL_INTERVAL_MS = 15000;

export function useNotificationPolling() {
  const addNotifications = useNotificationStore(
    (state) => state.addNotifications,
  );
  const isPanelOpen = useNotificationStore((state) => state.isPanelOpen);
  const showToast = useToastStore((state) => state.showToast);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPanelOpenRef = useRef(isPanelOpen);

  useEffect(() => {
    isPanelOpenRef.current = isPanelOpen;
  }, [isPanelOpen]);

  useEffect(() => {
    async function poll() {
      try {
        const newNotifications = await fetchNotificationPosts();
        addNotifications(newNotifications);

        if (!isPanelOpenRef.current && newNotifications.length > 0) {
          showToast(`${newNotifications.length} new notification(s)`);
        }
      } catch {
        // silently ignore a failed poll; will try again next tick
      }
    }

    function startPolling() {
      poll(); // fire immediately on start/resume
      intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
    }

    function stopPolling() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    }

    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
