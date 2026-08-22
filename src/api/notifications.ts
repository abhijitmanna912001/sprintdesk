import type { Notification } from "../types";

interface JsonPlaceholderPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export async function fetchNotificationPosts(): Promise<Notification[]> {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const posts: JsonPlaceholderPost[] = await response.json();

  return posts.map((post) => ({
    id: Date.now() + post.id, // unique per poll tick
    title: post.title.slice(0, 40),
    message: post.body.slice(0, 80),
    type: "task" as const,
    read: false,
    createdAt: new Date().toISOString(),
  }));
}
