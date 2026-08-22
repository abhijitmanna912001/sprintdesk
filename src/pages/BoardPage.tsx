import { Column } from "../components/board/Column";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { getUsersById } from "../lib/users";
import { useBoardStore } from "../store/boardStore";
import type { TaskStatus } from "../types";

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: "backlog", title: "Backlog" },
  { status: "in-progress", title: "In Progress" },
  { status: "review", title: "Review" },
  { status: "done", title: "Done" },
];

export function BoardPage() {
  const { isLoading: tasksLoading, isError: tasksError } = useTasks();

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();

  const tasks = useBoardStore((state) => state.tasks);

  if (tasksLoading || usersLoading) {
    return <div className="p-8">Loading board...</div>;
  }

  if (tasksError || usersError || !users) {
    return <div className="p-8">Failed to load board data.</div>;
  }

  const usersById = getUsersById(users);

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
            usersById={usersById}
          />
        ))}
      </div>
    </div>
  );
}
