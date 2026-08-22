import { StatusChart } from "../components/analytics/StatusChart";
import { useTasks } from "../hooks/useTasks";
import { useBoardStore } from "../store/boardStore";

export function AnalyticsPage() {
  const { isLoading, isError } = useTasks();
  const tasks = useBoardStore((state) => state.tasks);

  if (isLoading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  if (isError) {
    return <div className="p-8">Failed to load analytics data.</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusChart tasks={tasks} />
      </div>
    </div>
  );
}
