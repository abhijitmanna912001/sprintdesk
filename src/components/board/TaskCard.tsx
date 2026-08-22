import { useSortable } from "@dnd-kit/sortable";
import type { Task, User } from "../../types";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  assignee: User | undefined;
  isOverlay?: boolean;
}

export function TaskCard({
  task,
  assignee,
  isOverlay = false,
}: Readonly<TaskCardProps>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white border rounded p-3 shadow-sm ${
        isOverlay ? "cursor-grabbing shadow-lg" : "cursor-grab"
      }`}
    >
      <p className="font-medium">{task.title}</p>
      <p className="text-sm text-gray-500">{task.priority}</p>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>{assignee?.name ?? "Unassigned"}</span>
        <span>{task.dueDate}</span>
      </div>
    </div>
  );
}
