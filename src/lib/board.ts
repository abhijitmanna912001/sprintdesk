import type { Task, TaskStatus } from "../types";

export function getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks
    .filter((task) => task.status === status)
    .sort((a, b) => a.order - b.order);
}
