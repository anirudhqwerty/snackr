import { Request, Response } from "express";
import {
    loginUser,
    refreshAccessToken,
    registerUser,
    verifyJWT,
} from "../services/auth.service";

/**
 * POST /auth/register
 * Register a new user
 */
export async function registerHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email, password, role } = req.body;

    const result = await registerUser(email, password, role);

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    res.status(400).json({
      success: false,
      error: message,
      code: "REGISTRATION_FAILED",
    });
  }
}

/**
 * POST /auth/login
 * Login with email and password
 */
export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    res.status(401).json({
      success: false,
      error: message,
      code: "LOGIN_FAILED",
    });
  }
}

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
export async function refreshHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: "Refresh token is required",
        code: "MISSING_REFRESH_TOKEN",
      });
      return;
    }

    const tokens = await refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Token refresh failed";
    res.status(401).json({
      success: false,
      error: message,
      code: "REFRESH_FAILED",
    });
  }
}

/**
 * GET /auth/verify
 * Verify JWT token and return user info
 */
export async function verifyHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: "Authorization header is required",
        code: "MISSING_AUTH",
      });
      return;
    }

    const user = await verifyJWT(authHeader);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Verification failed";
    res.status(401).json({
      success: false,
      error: message,
      code: "VERIFICATION_FAILED",
    });
  }
}

/**
 * POST /auth/logout
 * Logout user (token invalidation happens on frontend)
 */
export async function logoutHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: "Logout failed",
      code: "LOGOUT_FAILED",
    });
  }
}
