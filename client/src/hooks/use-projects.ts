import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Project {
id: number;
title: string;
description: string;

techStack: string[];
skillsRequired: string[];
collaboratorsNeeded: number;

projectType: string;
duration: string;
contactInfo: string;

creatorId: string;

createdAt: string;
updatedAt: string;
}

/* ---------------- GET ALL PROJECTS ---------------- */

export function useProjects() {
return useQuery<Project[]>({
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
return useQuery<Project>({
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
enabled: !!id,


});
}

/* ---------------- CREATE PROJECT ---------------- */

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      console.log("Sending to backend:", data);

      const res = await fetch("/api/projects", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create project");
      }

      return result;
    },

    onSuccess: () => {
      console.log("Project created successfully");

      queryClient.invalidateQueries({
        queryKey: ["/api/projects"],
      });
    },

    onError: (error) => {
      console.error("Create project error:", error);
    },
  });
}
