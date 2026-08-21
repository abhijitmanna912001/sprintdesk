import { useTasks } from "../hooks/useTasks";
import { useBoardStore } from "../store/boardStore";

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
      <p>{tasks.length} tasks loaded</p>
      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border rounded p-2">
            {task.title} —{" "}
            <span className="text-sm text-gray-500">{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
