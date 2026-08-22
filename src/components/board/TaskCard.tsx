import type { Task, User } from "../../types";

interface TaskCardProps {
  task: Task;
  assignee: User | undefined;
}

export function TaskCard({ task, assignee }: Readonly<TaskCardProps>) {
  return (
    <div className="bg-white border rounded p-3 shadow-sm">
      <p className="font-medium">{task.title}</p>
      <p className="text-sm text-gray-500">{task.priority}</p>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>{assignee?.name ?? "Unassigned"}</span>
        <span>{task.dueDate}</span>
      </div>
    </div>
  );
}
