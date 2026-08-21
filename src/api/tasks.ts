import mockData from "../data/mock-data.json";
import type { Task } from "../types";

export function fetchTasks(): Promise<Task[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.tasks.slice(0, 30) as Task[]);
    }, 300);
  });
}
