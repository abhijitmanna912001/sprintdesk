import { getTasksByStatus } from "../../lib/board";
import type { Task, TaskStatus, User } from "../../types";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  usersById: Record<number, User>;
}

export function Column({
  status,
  title,
  tasks,
  usersById,
}: Readonly<ColumnProps>) {
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
          <TaskCard
            key={task.id}
            task={task}
            assignee={usersById[task.assigneeId]}
          />
        ))}
      </div>
    </div>
  );
}
