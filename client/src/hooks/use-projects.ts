import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* ---------------- GET ALL PROJECTS ---------------- */

export function useProjects() {
  return useQuery({
    queryKey: ["/api/projects"],

    queryFn: async () => {
      const res = await fetch("/api/projects", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

      return res.json();
    },
  });
}

/* ---------------- GET SINGLE PROJECT ---------------- */

export function useProject(id: number) {
  return useQuery({
    queryKey: ["/api/projects", id],

    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch project");
      }

      return res.json();
    },

    enabled: !!id, // prevents query running with id=0
  });
}


/* ---------------- CREATE PROJECT ---------------- */

export function useCreateProject() {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async (data: any) => {

      console.log("Sending project to backend:", data);

      const res = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      return res.json();
    },

    onSuccess: () => {

      console.log("Project created successfully");

      queryClient.invalidateQueries({
        queryKey: ["/api/projects"],
      });

    },

  });

}