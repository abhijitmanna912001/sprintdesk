import mockData from "../data/mock-data.json";
import type { Sprint } from "../types";

export function fetchSprints(): Promise<Sprint[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.sprints as Sprint[]);
    }, 200);
  });
}
