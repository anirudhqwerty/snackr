/**
 * Format error response
 */
export function formatError(error: unknown): { message: string; code: string } {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: "ERROR",
    };
  }
  return {
    message: "Unknown error occurred",
    code: "UNKNOWN_ERROR",
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Validate role
 */
export function isValidRole(
  role: string,
): role is "customer" | "vendor" | "delivery" {
  return ["customer", "vendor", "delivery"].includes(role);
}
