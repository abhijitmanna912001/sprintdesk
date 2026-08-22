import { useQuery } from "@tanstack/react-query";
import { fetchSprints } from "../api/sprints";

export function useSprints() {
  return useQuery({
    queryKey: ["sprints"],
    queryFn: fetchSprints,
  });
}
