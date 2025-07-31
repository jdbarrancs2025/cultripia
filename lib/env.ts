// Environment variable validation
export function validateEnv() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_CONVEX_URL",
  ] as const;

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}\n` +
        "Please check your .env.local file and ensure all required variables are set.",
    );
  }
}

// Validate environment variables on module load in development
if (process.env.NODE_ENV === "development") {
  try {
    validateEnv();
  } catch (error) {
    console.error("Environment validation failed:", error);
  }
}
