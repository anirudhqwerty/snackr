/**
 * Authentication context for managing user session and tokens
 */

import axios from "axios";
import React, { createContext, useCallback, useEffect, useState } from "react";
import * as authAPI from "../api/auth.api";
import { clearTokens as clientClearTokens, setTokens } from "../api/client";
import type { User } from "../types";
import {
    loadTokens,
    saveTokens,
    clearTokens as storageClearTokens,
} from "./storage";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  verifySession: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from storage on app startup
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const tokens = await loadTokens();

        if (tokens) {
          // Restore tokens
          setTokens(tokens.accessToken, tokens.refreshToken);
          setAccessToken(tokens.accessToken);

          // Verify session is still valid
          try {
            const isValid = await authAPI.verifySession(tokens.accessToken);
            if (isValid && isValid.user) {
              setUser(isValid.user);
            } else {
              // Tokens expired, clear them
              await storageClearTokens();
              clientClearTokens();
            }
          } catch (error) {
            const isUnauthorized =
              axios.isAxiosError(error) &&
              error.response?.status === 401;
            if (isUnauthorized) {
              await storageClearTokens();
              clientClearTokens();
            } else {
              throw error;
            }
          }
        }
      } catch (error) {
        const isUnauthorized =
          axios.isAxiosError(error) && error.response?.status === 401;
        if (isUnauthorized) {
          await storageClearTokens();
          clientClearTokens();
        } else {
          console.error("Failed to initialize auth:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);

      // Save tokens to storage
      await saveTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      setAccessToken(response.accessToken);
      setUser(response.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, role: string = "customer") => {
      try {
        const response = await authAPI.register(email, password, role);

        // Save tokens to storage
        await saveTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });

        setAccessToken(response.accessToken);
        setUser(response.user);
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear local state regardless of API success
      await storageClearTokens();
      clientClearTokens();
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = await loadTokens();
      if (!tokens || !tokens.refreshToken) {
        return false;
      }

      const response = await authAPI.refreshAccessToken(tokens.refreshToken);

      // Save new token
      await saveTokens({
        accessToken: response.accessToken,
        refreshToken: tokens.refreshToken,
      });

      setTokens(response.accessToken, tokens.refreshToken);
      setAccessToken(response.accessToken);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }, []);

  const verifySession = useCallback(async (): Promise<boolean> => {
    try {
      let token = accessToken;
      if (!token) {
        // Try to load from storage
        const tokens = await loadTokens();
        if (!tokens) return false;

        setTokens(tokens.accessToken, tokens.refreshToken);
        setAccessToken(tokens.accessToken);
        token = tokens.accessToken;
      }

      const isValid = await authAPI.verifySession(token);
      if (isValid && isValid.user) {
        setUser(isValid.user);
        return true;
      }
      return false;
    } catch (error) {
      const isUnauthorized =
        axios.isAxiosError(error) && error.response?.status === 401;
      if (isUnauthorized) {
        await storageClearTokens();
        clientClearTokens();
        return false;
      }
      console.error("Session verification failed:", error);
      return false;
    }
  }, [accessToken]);

  const value: AuthContextType = {
    user,
    isLoading,
    isSignedIn: !!user && !!accessToken,
    accessToken,
    login,
    register,
    logout,
    refreshToken,
    verifySession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
