import { Column } from "../components/board/Column";
import { useTasks } from "../hooks/useTasks";
import { useBoardStore } from "../store/boardStore";
import type { TaskStatus } from "../types";

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: "backlog", title: "Backlog" },
  { status: "in-progress", title: "In Progress" },
  { status: "review", title: "Review" },
  { status: "done", title: "Done" },
];

export function BoardPage() {
  const { isLoading, isError } = useTasks();
  const tasks = useBoardStore((state) => state.tasks);

  if (isLoading) {
    return <div className="p-8">Loading tasks...</div>;
  }

  if (isError) {
    return <div className="p-8">Failed to load tasks.</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-4">Board</h1>
      <div className="flex gap-4 overflow-x-auto">
        {COLUMNS.map((col) => (
          <Column
            key={col.status}
            status={col.status}
            title={col.title}
            tasks={tasks}
          />
        ))}
      </div>
    </div>
  );
}
