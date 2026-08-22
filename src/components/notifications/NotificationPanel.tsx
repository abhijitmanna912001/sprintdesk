import { useState } from "react";
import { useNotificationStore } from "../../store/notificationStore";

const PAGE_SIZE = 20;

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({
  onClose,
}: Readonly<NotificationPanelProps>) {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageItems = notifications.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-label="Close notifications"
      />
      <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {pageItems.length === 0 ? (
          <p className="text-sm text-gray-400 p-4">No notifications yet.</p>
        ) : (
          <div>
            {pageItems.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification.id)}
                className={`w-full text-left px-4 py-3 border-b hover:bg-gray-50 ${
                  notification.read ? "bg-white" : "bg-blue-50"
                }`}
              >
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {notification.message}
                </p>
              </button>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t text-sm">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
