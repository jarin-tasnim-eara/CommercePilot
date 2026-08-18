"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import LoadingState from "@/components/ui/LoadingState";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoadingState message="Checking your session…" />;
  }

  return <>{children}</>;
}