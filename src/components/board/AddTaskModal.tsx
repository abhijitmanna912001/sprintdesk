import { useState } from "react";
import { useBoardStore } from "../../store/boardStore";
import type { Task, TaskPriority } from "../../types";
import { useUsers } from "../../hooks/useUsers";

interface AddTaskModalProps {
  onClose: () => void;
}

export function AddTaskModal({ onClose }: Readonly<AddTaskModalProps>) {
  const addTask = useBoardStore((state) => state.addTask);
  const { data: users } = useUsers();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const newTask: Task = {
      id: Date.now(),
      title,
      description: "",
      status: "backlog",
      priority,
      assigneeId: Number(assigneeId),
      dueDate,
      sprintId: 3,
      order: Date.now(), // simple trick: always sorts last
      createdAt: new Date().toISOString(),
      completedAt: null,
      updatedAt: new Date().toISOString(),
    };

    addTask(newTask);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium mb-1"
            >
              Assignee
            </label>
            <select
              id="assigneeId"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                Select assignee
              </option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
