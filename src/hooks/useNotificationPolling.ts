import { useEffect, useRef } from "react";
import { useNotificationStore } from "../store/notificationStore";
import { fetchNotificationPosts } from "../api/notifications";

const POLL_INTERVAL_MS = 15000;

export function useNotificationPolling() {
  const addNotifications = useNotificationStore(
    (state) => state.addNotifications,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function poll() {
      try {
        const newNotifications = await fetchNotificationPosts();
        addNotifications(newNotifications);
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
