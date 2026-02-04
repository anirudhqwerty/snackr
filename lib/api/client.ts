/**
 * Axios API client with interceptors for JWT authentication
 * Handles request/response interceptors and error handling
 */

import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { env } from "../config/env";

let accessToken: string | null = null;
let refreshToken: string | null = null;

const createClient = (): AxiosInstance => {
  const client = axios.create({
    timeout: env.apiTimeout,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request Interceptor - Add JWT token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: unknown) => {
      return Promise.reject(error);
    },
  );

  // Response Interceptor - Handle token refresh
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError | unknown) => {
      const axiosError = error as AxiosError;
      const originalRequest =
        (axiosError?.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        }) || {};

      // Handle 401 Unauthorized - attempt token refresh
      if (
        axiosError?.response?.status === 401 &&
        !originalRequest._retry &&
        refreshToken
      ) {
        originalRequest._retry = true;

        try {
          // Token refresh logic will be implemented in auth.api.ts
          // This is a placeholder for automatic token refresh
          return client(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear tokens and redirect to login
          clearTokens();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
};

export const setTokens = (newAccessToken: string, newRefreshToken: string) => {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => refreshToken;

export const apiClient = createClient();
