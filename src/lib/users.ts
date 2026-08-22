import type { User } from "../types";

export function getUsersById(users: User[]): Record<number, User> {
  return users.reduce<Record<number, User>>((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});
}
