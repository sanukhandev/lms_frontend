"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getUserRole } from "@/util/api";

type UseAuthGuardProps = {
  requireRole?: string | null;
  redirectIfAuthenticated?: boolean;
};

export const useAuthGuard = ({
  requireRole = null,
  redirectIfAuthenticated = false,
}: UseAuthGuardProps) => {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    const role = getUserRole();

    if (!token || !role) {
      if (!redirectIfAuthenticated) {
        router.replace("/auth/signin");
      }
      return;
    }

    if (redirectIfAuthenticated) {
      // Already authenticated, redirect to dashboard
      const redirectPath =
        role === "admin" ? "/admin" :
        role === "instructor" ? "/instructor" :
        "/student";

      router.replace(redirectPath);
    } else if (requireRole && role !== requireRole) {
      // Authenticated but unauthorized
      router.replace("/auth/signin");
    }
  }, [requireRole, redirectIfAuthenticated, router]);
};
