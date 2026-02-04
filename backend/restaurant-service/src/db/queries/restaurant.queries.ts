import { QueryResult } from "pg";
import { pool } from "../index";

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  rating: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: Date;
  updated_at: Date;
}

// Restaurant Queries

export async function getRestaurants(
  limit: number = 20,
  offset: number = 0,
): Promise<Restaurant[]> {
  const query = `
    SELECT id, name, description, image_url, rating, is_active, created_at, updated_at
    FROM restaurants
    WHERE is_active = true
    ORDER BY rating DESC
    LIMIT $1 OFFSET $2
  `;

  try {
    const result: QueryResult<Restaurant> = await pool.query(query, [
      limit,
      offset,
    ]);
    return result.rows;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get restaurants: ${error.message}`);
    }
    throw error;
  }
}

export async function getRestaurantById(
  id: string,
): Promise<Restaurant | null> {
  const query = `
    SELECT id, name, description, image_url, rating, is_active, created_at, updated_at
    FROM restaurants
    WHERE id = $1
  `;

  try {
    const result: QueryResult<Restaurant> = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get restaurant: ${error.message}`);
    }
    throw error;
  }
}

export async function searchRestaurants(
  searchTerm: string,
): Promise<Restaurant[]> {
  const query = `
    SELECT id, name, description, image_url, rating, is_active, created_at, updated_at
    FROM restaurants
    WHERE is_active = true AND (name ILIKE $1 OR description ILIKE $1)
    ORDER BY rating DESC
    LIMIT 20
  `;

  try {
    const result: QueryResult<Restaurant> = await pool.query(query, [
      `%${searchTerm}%`,
    ]);
    return result.rows;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to search restaurants: ${error.message}`);
    }
    throw error;
  }
}

// Menu Item Queries

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const query = `
    SELECT id, restaurant_id, name, description, price, image_url, category, is_available, created_at, updated_at
    FROM menu_items
    WHERE restaurant_id = $1 AND is_available = true
    ORDER BY category, name
  `;

  try {
    const result: QueryResult<MenuItem> = await pool.query(query, [
      restaurantId,
    ]);
    return result.rows;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get menu items: ${error.message}`);
    }
    throw error;
  }
}

export async function getMenuItemById(
  itemId: string,
): Promise<MenuItem | null> {
  const query = `
    SELECT id, restaurant_id, name, description, price, image_url, category, is_available, created_at, updated_at
    FROM menu_items
    WHERE id = $1
  `;

  try {
    const result: QueryResult<MenuItem> = await pool.query(query, [itemId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get menu item: ${error.message}`);
    }
    throw error;
  }
}

// Review Queries

export async function getRestaurantReviews(
  restaurantId: string,
): Promise<Review[]> {
  const query = `
    SELECT id, restaurant_id, user_id, rating, comment, created_at, updated_at
    FROM reviews
    WHERE restaurant_id = $1
    ORDER BY created_at DESC
    LIMIT 20
  `;

  try {
    const result: QueryResult<Review> = await pool.query(query, [restaurantId]);
    return result.rows;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get reviews: ${error.message}`);
    }
    throw error;
  }
}

export async function createReview(
  restaurantId: string,
  userId: string,
  rating: number,
  comment?: string,
): Promise<Review> {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const query = `
    INSERT INTO reviews (restaurant_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING id, restaurant_id, user_id, rating, comment, created_at, updated_at
  `;

  try {
    const result: QueryResult<Review> = await pool.query(query, [
      restaurantId,
      userId,
      rating,
      comment || null,
    ]);

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create review: ${error.message}`);
    }
    throw error;
  }
}
