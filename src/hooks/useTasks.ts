import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchTasks } from "../api/tasks";
import { useBoardStore } from "../store/boardStore";

export function useTasks() {
  const setTasks = useBoardStore((state) => state.setTasks);
  const tasksInStore = useBoardStore((state) => state.tasks);

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    enabled: tasksInStore.length === 0, // only fetch if store is empty
  });

  useEffect(() => {
    if (query.data) {
      setTasks(query.data);
    }
  }, [query.data]);

  return query;
}
