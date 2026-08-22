import { useDroppable } from "@dnd-kit/core";
import { getTasksByStatus } from "../../lib/board";
import type { Task, TaskStatus, User } from "../../types";
import { TaskCard } from "./TaskCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { memo, useMemo } from "react";

interface ColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  usersById: Record<number, User>;
  onTaskClick: (task: Task) => void;
}

function ColumnComponent({
  status,
  title,
  tasks,
  usersById,
  onTaskClick,
}: Readonly<ColumnProps>) {
  const columnTasks = useMemo(
    () => getTasksByStatus(tasks, status),
    [tasks, status],
  );

  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-62.5 bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
    >
      <h2 className="font-semibold mb-3 flex items-center justify-between text-gray-900 dark:text-white">
        {title}
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
          {columnTasks.length}
        </span>
      </h2>

      <SortableContext
        items={columnTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={usersById[task.assigneeId]}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export const Column = memo(ColumnComponent);
