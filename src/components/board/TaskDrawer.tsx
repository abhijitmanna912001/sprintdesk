import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { useBoardStore } from "../../store/boardStore";
import type { Comment, Task, TaskPriority, User } from "../../types";
import { useComments } from "../../hooks/useComments";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";

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

  const { data: fetchedComments, isLoading: commentsLoading } = useComments(
    task.id,
  );
  const currentUser = useAuthStore((state) => state.user);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const allComments = [...(fetchedComments ?? []), ...localComments];

  function handleAddComment() {
    if (!newComment.trim() || !currentUser) return;

    const comment: Comment = {
      id: Date.now(),
      taskId: task.id,
      authorId: currentUser.id,
      message: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    setLocalComments((prev) => [...prev, comment]);
    setNewComment("");
  }

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

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl p-6 overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          {isEditing ? (
            <input
              value={draft.title}
              onChange={(e) => updateDraft("title", e.target.value)}
              className="text-xl font-semibold border-b border-gray-300 dark:border-gray-600 w-full mr-4 bg-transparent text-gray-900 dark:text-white"
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {task.title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Description
            </h3>
            {isEditing ? (
              <textarea
                value={draft.description}
                onChange={(e) => updateDraft("description", e.target.value)}
                className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                rows={3}
              />
            ) : (
              <p className="mt-1 text-gray-900 dark:text-gray-100">
                {task.description || "No description."}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Priority
              </h3>
              {isEditing ? (
                <select
                  value={draft.priority}
                  onChange={(e) =>
                    updateDraft("priority", e.target.value as TaskPriority)
                  }
                  className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <p className="mt-1 text-gray-900 dark:text-gray-100">
                  {task.priority}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Assignee
              </h3>
              {isEditing ? (
                <select
                  value={draft.assigneeId}
                  onChange={(e) =>
                    updateDraft("assigneeId", Number(e.target.value))
                  }
                  className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  {users?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-1 text-gray-900 dark:text-gray-100">
                  {assignee?.name ?? "Unassigned"}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Due Date
              </h3>
              {isEditing ? (
                <input
                  type="date"
                  value={draft.dueDate}
                  onChange={(e) => updateDraft("dueDate", e.target.value)}
                  className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="mt-1 text-gray-900 dark:text-gray-100">
                  {task.dueDate}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100">
                {task.status}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave}>
                Save
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Comments
          </h3>

          {commentsLoading ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Loading comments...
            </p>
          ) : (
            <div className="space-y-3 mb-3">
              {allComments.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  No comments yet.
                </p>
              )}
              {allComments.map((comment) => {
                const author = users?.find((u) => u.id === comment.authorId);
                return (
                  <div
                    key={comment.id}
                    className="text-sm bg-gray-50 dark:bg-gray-900 rounded p-2"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {author?.name ?? "Unknown"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {comment.message}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <Button
              type="button"
              onClick={handleAddComment}
              className="text-sm px-3 py-2"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
