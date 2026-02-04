/**
 * User API endpoints
 * Handles user profile, address management
 */

import axios from "axios";
import { env } from "../config/env";
import type {
    Address,
    UpdateUserRequest,
    UpdateUserResponse,
    User,
} from "../types";
import { getAccessToken } from "./client";

const createAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

/**
 * Get current user profile
 * @returns Current user information
 */
export async function getCurrentUser(): Promise<User> {
  const response = await axios.get<User>(`${env.userServiceUrl}/users/me`, {
    timeout: env.apiTimeout,
    headers: createAuthHeaders(),
  });
  return response.data;
}

/**
 * Update user profile
 * @param data User data to update
 * @returns Updated user information
 */
export async function updateUserProfile(
  data: UpdateUserRequest,
): Promise<UpdateUserResponse> {
  const response = await axios.put<UpdateUserResponse>(
    `${env.userServiceUrl}/users/me`,
    data,
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Get user addresses
 * @returns List of user addresses
 */
export async function getUserAddresses(): Promise<Address[]> {
  const response = await axios.get<Address[]>(
    `${env.userServiceUrl}/users/addresses`,
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Add new address to user profile
 * @param address Address to add
 * @returns Created address
 */
export async function addUserAddress(address: Address): Promise<Address> {
  const response = await axios.post<Address>(
    `${env.userServiceUrl}/users/addresses`,
    address,
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Update existing user address
 * @param addressId Address ID to update
 * @param address Updated address data
 * @returns Updated address
 */
export async function updateUserAddress(
  addressId: string,
  address: Partial<Address>,
): Promise<Address> {
  const response = await axios.put<Address>(
    `${env.userServiceUrl}/users/addresses/${addressId}`,
    address,
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Delete user address
 * @param addressId Address ID to delete
 */
export async function deleteUserAddress(addressId: string): Promise<void> {
  await axios.delete(`${env.userServiceUrl}/users/addresses/${addressId}`, {
    timeout: env.apiTimeout,
    headers: createAuthHeaders(),
  });
}

/**
 * Set default delivery address
 * @param addressId Address ID to set as default
 * @returns Updated address
 */
export async function setDefaultAddress(addressId: string): Promise<Address> {
  const response = await axios.post<Address>(
    `${env.userServiceUrl}/users/addresses/${addressId}/default`,
    {},
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}
