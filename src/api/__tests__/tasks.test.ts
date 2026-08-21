import { describe, it, expect } from "vitest";
import { fetchTasks } from "../tasks";

describe("fetchTasks", () => {
  it("returns an array of 30 tasks", async () => {
    const tasks = await fetchTasks();
    expect(tasks).toHaveLength(30);
  });

  it("returns tasks with the expected shape", async () => {
    const tasks = await fetchTasks();
    expect(tasks[0]).toHaveProperty("id");
    expect(tasks[0]).toHaveProperty("status");
    expect(tasks[0]).toHaveProperty("title");
  });
});
