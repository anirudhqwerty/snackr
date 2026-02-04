/**
 * Authentication API endpoints
 * Handles login, register, token refresh
 */

import axios from "axios";
import { env } from "../config/env";
import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    RegisterRequest,
    RegisterResponse,
} from "../types";
import { clearTokens, setTokens } from "./client";

/**
 * Login user with email and password
 * @param email User email
 * @param password User password
 * @returns Login response with tokens and user info
 */
export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const request: LoginRequest = { email, password };
  const response = await axios.post<LoginResponse>(
    `${env.authServiceUrl}/auth/login`,
    request,
    { timeout: env.apiTimeout },
  );

  // Store tokens after successful login
  setTokens(response.data.accessToken, response.data.refreshToken);

  return response.data;
}

/**
 * Register new user
 * @param email User email
 * @param password User password
 * @param role User role (customer, vendor, delivery)
 * @returns Registration response with tokens and user info
 */
export async function register(
  email: string,
  password: string,
  role: string = "customer",
): Promise<RegisterResponse> {
  const request: RegisterRequest = { email, password, role };
  const response = await axios.post<RegisterResponse>(
    `${env.authServiceUrl}/auth/register`,
    request,
    { timeout: env.apiTimeout },
  );

  // Store tokens after successful registration
  setTokens(response.data.accessToken, response.data.refreshToken);

  return response.data;
}

/**
 * Refresh access token using refresh token
 * @param refreshToken Refresh token
 * @returns New access token
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  const request: RefreshTokenRequest = { refreshToken };
  const response = await axios.post<RefreshTokenResponse>(
    `${env.authServiceUrl}/auth/refresh`,
    request,
    { timeout: env.apiTimeout },
  );

  // Update access token
  setTokens(response.data.accessToken, refreshToken);

  return response.data;
}

/**
 * Logout user and clear tokens
 */
export async function logout(): Promise<void> {
  try {
    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");
    await axios.post(
      `${env.authServiceUrl}/auth/logout`,
      {},
      {
        timeout: env.apiTimeout,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      },
    );
  } finally {
    // Clear tokens regardless of API response
    clearTokens();
  }
}

/**
 * Verify current session token
 * @param token Access token to verify
 * @returns Current user info if token is valid
 */
export async function verifySession(token: string) {
  const response = await axios.get(`${env.authServiceUrl}/auth/verify`, {
    timeout: env.apiTimeout,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
