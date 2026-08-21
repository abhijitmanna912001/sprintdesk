import mockData from "../data/mock-data.json";
import type { User } from "../types";

export function fetchUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.users as User[]);
    }, 200);
  });
}
