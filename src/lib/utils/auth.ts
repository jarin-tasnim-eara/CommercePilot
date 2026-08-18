import { AuthUser } from "@/types";
import users from "@/data/users.json";

interface SeedUser extends AuthUser {
  password: string;
}

export function findUserByCredentials(
  email: string,
  password: string,
): AuthUser | null {
  const match = (users as SeedUser[]).find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password,
  );
  if (!match) return null;
  return {
    id: match.id,
    name: match.name,
    email: match.email,
    role: match.role,
    avatarUrl: match.avatarUrl,
  };
}