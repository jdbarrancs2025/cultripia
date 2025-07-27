import { UserRole } from "@/lib/auth"

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      role?: UserRole
    }
  }
}

export {}