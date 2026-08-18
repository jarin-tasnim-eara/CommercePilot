import { UserRole } from "@/types";

export const SESSION_COOKIE = "cp_role";

const WEEK_IN_SECONDS = 60 * 60 * 24 * 7;

export function setSessionCookie(role: UserRole, rememberMe: boolean) {
  if (typeof document === "undefined") return;
  const maxAge = rememberMe ? `; max-age=${WEEK_IN_SECONDS}` : "";
  document.cookie = `${SESSION_COOKIE}=${role}; path=/${maxAge}; samesite=lax`;
}

export function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}