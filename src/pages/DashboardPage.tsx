import { DataTable } from "../components/ui/DataTable";
import { Skeleton } from "../components/ui/Skeleton";
import { useTasks } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { getUsersById } from "../lib/users";
import { useBoardStore } from "../store/boardStore";
import type { Task } from "../types";

export function DashboardPage() {
  const { isLoading: tasksLoading, isError: tasksError } = useTasks();
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers();
  const tasks = useBoardStore((state) => state.tasks);

  if (tasksLoading || usersLoading) {
    return (
      <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
        <Skeleton className="h-8 w-40 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (tasksError || usersError || !users) {
    return <div className="p-8">Failed to load dashboard data.</div>;
  }

  const usersById = getUsersById(users);

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <DataTable<Task>
        data={tasks}
        getRowKey={(task) => task.id}
        columns={[
          { header: "Title", render: (task) => task.title },
          { header: "Status", render: (task) => task.status },
          { header: "Priority", render: (task) => task.priority },
          {
            header: "Assignee",
            render: (task) => usersById[task.assigneeId]?.name ?? "Unassigned",
          },
          { header: "Due Date", render: (task) => task.dueDate },
        ]}
      />
    </div>
  );
}
