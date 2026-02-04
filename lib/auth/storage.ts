/**
 * Persistent token storage using AsyncStorage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_STORAGE_KEY = "snackr_tokens";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Save tokens to persistent storage
 */
export async function saveTokens(tokens: StoredTokens): Promise<void> {
  try {
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error("Failed to save tokens:", error);
  }
}

/**
 * Load tokens from persistent storage
 */
export async function loadTokens(): Promise<StoredTokens | null> {
  try {
    const stored = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StoredTokens;
  } catch (error) {
    console.error("Failed to load tokens:", error);
    return null;
  }
}

/**
 * Clear tokens from persistent storage
 */
export async function clearTokens(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
}
