import { beforeEach, describe, expect, it } from "vitest";
import type { Task } from "../../types";
import { useBoardStore } from "../boardStore";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    title: "Test task",
    description: "",
    status: "backlog",
    priority: "medium",
    assigneeId: 1,
    dueDate: "2026-08-20",
    sprintId: 1,
    order: 0,
    createdAt: "2026-08-15T09:00:00Z",
    completedAt: null,
    updatedAt: "2026-08-15T09:00:00Z",
    ...overrides,
  };
}

describe("boardStore", () => {
  beforeEach(() => {
    useBoardStore.getState().resetStore();
    localStorage.clear();
  });

  it("adds a task", () => {
    const task = makeTask({ id: 1 });
    useBoardStore.getState().addTask(task);

    expect(useBoardStore.getState().tasks).toHaveLength(1);
    expect(useBoardStore.getState().tasks[0].id).toBe(1);
  });

  it("deletes a task", () => {
    useBoardStore.getState().addTask(makeTask({ id: 1 }));
    useBoardStore.getState().addTask(makeTask({ id: 2 }));

    useBoardStore.getState().deleteTask(1);

    const tasks = useBoardStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(2);
  });

  it("moves a task to a different column", () => {
    useBoardStore
      .getState()
      .addTask(makeTask({ id: 1, status: "backlog", order: 0 }));

    useBoardStore.getState().moveTask(1, "in-progress", 0);

    const movedTask = useBoardStore.getState().tasks.find((t) => t.id === 1);
    expect(movedTask?.status).toBe("in-progress");
  });

  it("reorders tasks within the same column", () => {
    useBoardStore
      .getState()
      .addTask(makeTask({ id: 1, status: "backlog", order: 0 }));
    useBoardStore
      .getState()
      .addTask(makeTask({ id: 2, status: "backlog", order: 1 }));

    useBoardStore.getState().moveTask(2, "backlog", 0);

    const tasks = useBoardStore
      .getState()
      .tasks.sort((a, b) => a.order - b.order);
    expect(tasks[0].id).toBe(2);
    expect(tasks[1].id).toBe(1);
  });
});
