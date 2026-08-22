import type { Sprint, Task } from "../types";

export interface SprintVelocityPoint {
  sprintName: string;
  completed: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface PriorityBreakdownPoint {
  status: string;
  low: number;
  medium: number;
  high: number;
}

export interface CompletionTrendPoint {
  date: string;
  completed: number;
}

const STATUS_LABELS: Record<Task["status"], string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export function getSprintVelocity(
  tasks: Task[],
  sprints: Sprint[],
): SprintVelocityPoint[] {
  return sprints.map((sprint) => {
    const completedCount = tasks.filter(
      (task) => task.sprintId === sprint.id && task.status === "done",
    ).length;

    return {
      sprintName: sprint.name,
      completed: completedCount,
    };
  });
}

export function getTaskStatusDistribution(tasks: Task[]): StatusCount[] {
  return (Object.keys(STATUS_LABELS) as Task["status"][]).map((status) => ({
    status: STATUS_LABELS[status],
    count: tasks.filter((task) => task.status === status).length,
  }));
}

export function getPriorityBreakdown(tasks: Task[]): PriorityBreakdownPoint[] {
  return (Object.keys(STATUS_LABELS) as Task["status"][]).map((status) => {
    const statusTasks = tasks.filter((task) => task.status === status);

    return {
      status: STATUS_LABELS[status],
      low: statusTasks.filter((t) => t.priority === "low").length,
      medium: statusTasks.filter((t) => t.priority === "medium").length,
      high: statusTasks.filter((t) => t.priority === "high").length,
    };
  });
}

export function getCompletionTrend(tasks: Task[]): CompletionTrendPoint[] {
  const completedTasks = tasks.filter((task) => task.completedAt !== null);

  const countsByDate = completedTasks.reduce<Record<string, number>>(
    (acc, task) => {
      const date = task.completedAt!.split("T")[0]; // "2026-08-18T16:20:00Z" -> "2026-08-18"
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {},
  );

  return Object.entries(countsByDate)
    .map(([date, completed]) => ({ date, completed }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
