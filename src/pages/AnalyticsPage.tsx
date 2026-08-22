import { CompletionTrendChart } from "../components/analytics/CompletionTrendChart";
import { PriorityChart } from "../components/analytics/PriorityChart";
import { StatusChart } from "../components/analytics/StatusChart";
import { VelocityChart } from "../components/analytics/VelocityChart";
import { useSprints } from "../hooks/useSprints";
import { useTasks } from "../hooks/useTasks";
import { useBoardStore } from "../store/boardStore";

export function AnalyticsPage() {
  const { isLoading: tasksLoading, isError: tasksError } = useTasks();

  const {
    data: sprints,
    isLoading: sprintsLoading,
    isError: sprintsError,
  } = useSprints();

  const tasks = useBoardStore((state) => state.tasks);

  if (tasksLoading || sprintsLoading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  if (tasksError || sprintsError || !sprints) {
    return <div className="p-8">Failed to load analytics data.</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Analytics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusChart tasks={tasks} />
        <VelocityChart tasks={tasks} sprints={sprints} />
        <PriorityChart tasks={tasks} />
        <CompletionTrendChart tasks={tasks} />
      </div>
    </div>
  );
}
