import { useSortable } from "@dnd-kit/sortable";
import type { Task, User } from "../../types";
import { CSS } from "@dnd-kit/utilities";
import { useBoardStore } from "../../store/boardStore";

interface TaskCardProps {
  task: Task;
  assignee: User | undefined;
  isOverlay?: boolean;
  onClick?: () => void;
}

export function TaskCard({
  task,
  assignee,
  isOverlay = false,
  onClick,
}: Readonly<TaskCardProps>) {
  const deleteTask = useBoardStore((state) => state.deleteTask);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Delete "${task.title}"? This cannot be undone.`,
    );
    if (confirmed) {
      deleteTask(task.id);
    }
  }

  return (
    <div className="relative group">
      <button
        type="button"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={onClick}
        aria-label={`Task: ${task.title}`}
        className={`w-full text-left bg-white border rounded p-3 shadow-sm ${
          isOverlay ? "cursor-grabbing shadow-lg" : "cursor-grab"
        }`}
      >
        <p className="font-medium pr-6">{task.title}</p>
        <p className="text-sm text-gray-500">{task.priority}</p>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>{assignee?.name ?? "Unassigned"}</span>
          <span>{task.dueDate}</span>
        </div>
      </button>

      {!isOverlay && (
        <button
          type="button"
          onClick={handleDelete}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Delete task ${task.title}`}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          ✕
        </button>
      )}
    </div>
  );
}
