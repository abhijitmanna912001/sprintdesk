import { useEffect } from "react";
import { useToastStore } from "../../store/toastStore";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          onDismiss={dismissToast}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  id: number;
  message: string;
  onDismiss: (id: number) => void;
}

function ToastItem({ id, message, onDismiss }: Readonly<ToastItemProps>) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-lg min-w-64">
      {message}
    </div>
  );
}
