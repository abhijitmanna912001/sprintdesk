import type { Sprint, Task } from "../types";

export interface SprintVelocityPoint {
  sprintName: string;
  completed: number;
}

export interface StatusCount {
  status: string;
  count: number;
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
