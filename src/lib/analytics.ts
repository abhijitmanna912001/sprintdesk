import type { Sprint, Task } from "../types";

export interface SprintVelocityPoint {
  sprintName: string;
  completed: number;
}

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
