import { NextFunction, Request, Response } from "express";

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

export async function verifyAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: "Missing authorization header",
      code: "MISSING_AUTH",
    });
    return;
  }

  try {
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || "http://auth-service:3001";
    const response = await fetch(`${authServiceUrl}/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      res.status(401).json({
        error: "Invalid or expired token",
        code: "INVALID_TOKEN",
      });
      return;
    }

    const data: any = await response.json();
    req.user = data.data.user;
    next();
  } catch (error) {
    res.status(500).json({
      error: "Failed to verify token",
      code: "VERIFICATION_ERROR",
    });
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  console.error("[Restaurant Error]", err.message);
  res.status(500).json({
    error: err.message || "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
