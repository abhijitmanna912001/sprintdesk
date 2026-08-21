import { getTasksByStatus } from "../../lib/board";
import type { Task, TaskStatus } from "../../types";

interface ColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

export function Column({ status, title, tasks }: Readonly<ColumnProps>) {
  const columnTasks = getTasksByStatus(tasks, status);

  return (
    <div className="flex-1 min-w-62.5 bg-gray-50 rounded-lg p-3">
      <h2 className="font-semibold mb-3 flex items-center justify-between">
        {title}
        <span className="text-sm text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">
          {columnTasks.length}
        </span>
      </h2>

      <div className="space-y-2">
        {columnTasks.map((task) => (
          <div key={task.id} className="bg-white border rounded p-3 shadow-sm">
            <p className="font-medium">{task.title}</p>
            <p className="text-sm text-gray-500">{task.priority}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
