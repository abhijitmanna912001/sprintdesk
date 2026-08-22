import type { Task, User } from "../../types";

interface TaskDrawerProps {
  task: Task;
  assignee: User | undefined;
  onClose: () => void;
}

export function TaskDrawer({
  task,
  assignee,
  onClose,
}: Readonly<TaskDrawerProps>) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close task details"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1">{task.description || "No description."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">{task.status}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
              <p className="mt-1">{task.priority}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assignee</h3>
              <p className="mt-1">{assignee?.name ?? "Unassigned"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
              <p className="mt-1">{task.dueDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
