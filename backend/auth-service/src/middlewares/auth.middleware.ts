import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/auth.service";

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: "customer" | "vendor" | "delivery";
      };
    }
  }
}

/**
 * JWT verification middleware
 * Extracts and verifies JWT from Authorization header
 */
export function verifyJWTMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: "Missing authorization header",
      code: "MISSING_AUTH",
    });
    return;
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      error: "Invalid or expired token",
      code: "INVALID_TOKEN",
    });
    return;
  }

  // Attach user to request
  req.user = payload;
  next();
}

/**
 * Role-based authorization middleware
 * Checks if user has one of the required roles
 */
export function requireRole(
  ...roles: Array<"customer" | "vendor" | "delivery">
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: "User not authenticated",
        code: "NOT_AUTHENTICATED",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access denied. Required roles: ${roles.join(", ")}`,
        code: "FORBIDDEN",
      });
      return;
    }

    next();
  };
}

/**
 * Error handling middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error("[Auth Error]", err.message);

  res.status(500).json({
    error: err.message || "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
