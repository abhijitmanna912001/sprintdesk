import { describe, expect, it } from "vitest";
import type { Sprint, Task } from "../../types";
import { getSprintVelocity, getTaskStatusDistribution } from "../analytics";

const sprints: Sprint[] = [
  { id: 1, name: "Sprint 1", startDate: "2026-07-20", endDate: "2026-07-31" },
  { id: 2, name: "Sprint 2", startDate: "2026-08-03", endDate: "2026-08-14" },
];

const tasks: Task[] = [
  { id: 1, sprintId: 1, status: "done" } as Task,
  { id: 2, sprintId: 1, status: "done" } as Task,
  { id: 3, sprintId: 1, status: "backlog" } as Task,
  { id: 4, sprintId: 2, status: "done" } as Task,
];

describe("getSprintVelocity", () => {
  it("counts completed tasks per sprint", () => {
    const result = getSprintVelocity(tasks, sprints);
    expect(result).toEqual([
      { sprintName: "Sprint 1", completed: 2 },
      { sprintName: "Sprint 2", completed: 1 },
    ]);
  });

  it("returns 0 for a sprint with no completed tasks", () => {
    const emptySprintTasks: Task[] = [
      { id: 1, sprintId: 1, status: "backlog" } as Task,
    ];
    const result = getSprintVelocity(emptySprintTasks, sprints);
    expect(result[0].completed).toBe(0);
    expect(result[1].completed).toBe(0);
  });
});

describe("getTaskStatusDistribution", () => {
  it("counts tasks in each status", () => {
    const testTasks: Task[] = [
      { id: 1, status: "backlog" } as Task,
      { id: 2, status: "backlog" } as Task,
      { id: 3, status: "done" } as Task,
    ];

    const result = getTaskStatusDistribution(testTasks);

    expect(result).toEqual([
      { status: "Backlog", count: 2 },
      { status: "In Progress", count: 0 },
      { status: "Review", count: 0 },
      { status: "Done", count: 1 },
    ]);
  });
});
