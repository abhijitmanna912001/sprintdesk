import { useQuery } from "@tanstack/react-query";
import { fetchCommentsByTaskId } from "../api/comments";

export function useComments(taskId: number) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchCommentsByTaskId(taskId),
  });
}
