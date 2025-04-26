"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getUserRole } from "@/util/api";

type UseAuthGuardProps = {
  requireRole?: string | null;
  redirectIfAuthenticated?: boolean;
};

export const useAuthGuard = ({ requireRole, redirectIfAuthenticated = false }: UseAuthGuardProps) => {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    const role = getUserRole();

    if (redirectIfAuthenticated && token && role) {
      // User is logged in and should be redirected away from login/register
      const redirectPath = role === "admin" ? "/admin"
                        : role === "instructor" ? "/instructor"
                        : "/student";
      router.push(redirectPath);
      return;
    }

    if (!redirectIfAuthenticated) {
      // Route requires auth
      if (!token || !role || (requireRole && role !== requireRole)) {
        router.push("/login");
      }
    }
  }, [requireRole, redirectIfAuthenticated, router]);
};
