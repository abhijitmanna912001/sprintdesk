import mockData from "../data/mock-data.json";
import type { Comment } from "../types";

export function fetchCommentsByTaskId(taskId: number): Promise<Comment[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const comments = (mockData.comments as Comment[]).filter(
        (comment) => comment.taskId === taskId,
      );
      resolve(comments);
    }, 200);
  });
}
