import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/react";
import { useEffect } from "react";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {

  const response = await fetch("/api/me", {
    credentials: "include",
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function logout(): Promise<void> {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function useAuth() {

  const { isLoaded, isSignedIn } = useClerkAuth();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoaded || isSignedIn) {
      return;
    }

    queryClient.setQueryData(["/api/me"], null);
  }, [isLoaded, isSignedIn, queryClient]);

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/me"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: isLoaded && isSignedIn,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/me"], null);
    },
  });

  return {
    user,
    isLoading: !isLoaded || isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
