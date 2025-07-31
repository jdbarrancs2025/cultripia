import { auth } from "@clerk/nextjs/server";

export type UserRole = "traveler" | "host" | "admin";

export async function getUserRole(): Promise<UserRole> {
  const { sessionClaims } = await auth();

  // Get role from Clerk metadata, default to traveler
  const role = sessionClaims?.metadata?.role as UserRole | undefined;
  return role || "traveler";
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export async function requireRole(allowedRoles: UserRole[]) {
  const role = await getUserRole();

  if (!hasRole(role, allowedRoles)) {
    throw new Error(
      `Unauthorized: Required role(s): ${allowedRoles.join(", ")}`,
    );
  }

  return role;
}
