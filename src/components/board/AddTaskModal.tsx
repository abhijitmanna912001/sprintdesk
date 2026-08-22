import { useState } from "react";
import { useBoardStore } from "../../store/boardStore";
import type { Task, TaskPriority } from "../../types";
import { useUsers } from "../../hooks/useUsers";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Add Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Title"
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Select
              label="Priority"
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div>
            <Select
              label="Assignee"
              id="assigneeId"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select assignee
              </option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Input
              label="Due Date"
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
