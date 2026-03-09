import { useQuery } from "@tanstack/react-query";

export function useMyApplications() {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const res = await fetch("/api/my-applications");
      return res.json();
    },
  });
}