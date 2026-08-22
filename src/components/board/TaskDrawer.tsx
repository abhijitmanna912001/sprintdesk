import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { useBoardStore } from "../../store/boardStore";
import type { Task, TaskPriority, User } from "../../types";

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
  const updateTask = useBoardStore((state) => state.updateTask);
  const { data: users } = useUsers();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Task>(task);

  function updateDraft<K extends keyof Task>(field: K, value: Task[K]) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    updateTask(task.id, draft);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraft(task);
    setIsEditing(false);
  }

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
          {isEditing ? (
            <input
              value={draft.title}
              onChange={(e) => updateDraft("title", e.target.value)}
              className="text-xl font-semibold border-b w-full mr-4"
            />
          ) : (
            <h2 className="text-xl font-semibold">{task.title}</h2>
          )}
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
            {isEditing ? (
              <textarea
                value={draft.description}
                onChange={(e) => updateDraft("description", e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                rows={3}
              />
            ) : (
              <p className="mt-1">{task.description || "No description."}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
              {isEditing ? (
                <select
                  value={draft.priority}
                  onChange={(e) =>
                    updateDraft("priority", e.target.value as TaskPriority)
                  }
                  className="mt-1 w-full border rounded px-2 py-1"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <p className="mt-1">{task.priority}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Assignee</h3>
              {isEditing ? (
                <select
                  value={draft.assigneeId}
                  onChange={(e) =>
                    updateDraft("assigneeId", Number(e.target.value))
                  }
                  className="mt-1 w-full border rounded px-2 py-1"
                >
                  {users?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-1">{assignee?.name ?? "Unassigned"}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
              {isEditing ? (
                <input
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => updateDraft("dueDate", e.target.value)}
                  className="mt-1 w-full border rounded px-2 py-1"
                />
              ) : (
                <p className="mt-1">{task.dueDate}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">{task.status}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
