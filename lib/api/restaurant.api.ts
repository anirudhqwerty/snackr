/**
 * Restaurant API endpoints
 * Handles restaurant browsing and menu fetching
 */

import axios from "axios";
import { env } from "../config/env";
import type {
    MenuItem,
    PaginationParams,
    RestaurantDetailsResponse,
    RestaurantListResponse,
} from "../types";
import { getAccessToken } from "./client";

const createAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

/**
 * Get list of restaurants
 * @param params Pagination and filter parameters
 * @returns List of restaurants with pagination info
 */
export async function getRestaurants(
  params?: PaginationParams,
): Promise<RestaurantListResponse> {
  const response = await axios.get<RestaurantListResponse>(
    `${env.restaurantServiceUrl}/restaurants`,
    {
      timeout: env.apiTimeout,
      params,
    },
  );
  return response.data;
}

/**
 * Search restaurants by name or cuisine
 * @param query Search query
 * @param params Pagination parameters
 * @returns Filtered list of restaurants
 */
export async function searchRestaurants(
  query: string,
  params?: PaginationParams,
): Promise<RestaurantListResponse> {
  const response = await axios.get<RestaurantListResponse>(
    `${env.restaurantServiceUrl}/restaurants/search`,
    {
      timeout: env.apiTimeout,
      params: { q: query, ...params },
    },
  );
  return response.data;
}

/**
 * Get restaurant details including menu
 * @param restaurantId Restaurant ID
 * @returns Restaurant details with menu items
 */
export async function getRestaurantDetails(
  restaurantId: string,
): Promise<RestaurantDetailsResponse> {
  const response = await axios.get<RestaurantDetailsResponse>(
    `${env.restaurantServiceUrl}/restaurants/${restaurantId}`,
    { timeout: env.apiTimeout },
  );
  return response.data;
}

/**
 * Get menu items for a restaurant
 * @param restaurantId Restaurant ID
 * @param category Optional category filter
 * @returns List of menu items
 */
export async function getRestaurantMenu(
  restaurantId: string,
  category?: string,
): Promise<MenuItem[]> {
  const response = await axios.get<MenuItem[]>(
    `${env.restaurantServiceUrl}/restaurants/${restaurantId}/menu`,
    {
      timeout: env.apiTimeout,
      params: category ? { category } : undefined,
    },
  );
  return response.data;
}

/**
 * Get restaurant by coordinates (nearby restaurants)
 * @param latitude User latitude
 * @param longitude User longitude
 * @param radius Search radius in kilometers
 * @param params Pagination parameters
 * @returns List of nearby restaurants
 */
export async function getNearbyRestaurants(
  latitude: number,
  longitude: number,
  radius: number = 5,
  params?: PaginationParams,
): Promise<RestaurantListResponse> {
  const response = await axios.get<RestaurantListResponse>(
    `${env.restaurantServiceUrl}/restaurants/nearby`,
    {
      timeout: env.apiTimeout,
      params: {
        lat: latitude,
        lng: longitude,
        radius,
        ...params,
      },
    },
  );
  return response.data;
}

/**
 * Get restaurant reviews
 * @param restaurantId Restaurant ID
 * @param params Pagination parameters
 * @returns List of reviews
 */
export async function getRestaurantReviews(
  restaurantId: string,
  params?: PaginationParams,
): Promise<any> {
  const response = await axios.get(
    `${env.restaurantServiceUrl}/restaurants/${restaurantId}/reviews`,
    {
      timeout: env.apiTimeout,
      params,
    },
  );
  return response.data;
}

/**
 * Submit review for restaurant
 * @param restaurantId Restaurant ID
 * @param review Review data
 * @returns Created review
 */
export async function submitRestaurantReview(
  restaurantId: string,
  review: {
    rating: number;
    comment: string;
  },
): Promise<any> {
  const response = await axios.post(
    `${env.restaurantServiceUrl}/restaurants/${restaurantId}/reviews`,
    review,
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}
