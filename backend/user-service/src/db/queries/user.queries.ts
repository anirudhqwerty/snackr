import { QueryResult } from "pg";
import { pool } from "../index";

export interface UserProfile {
  id: string;
  auth_user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserAddress {
  id: string;
  user_id: string;
  label: string | null;
  street_address: string;
  city: string;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

// User Profile Queries

export async function createUserProfile(
  authUserId: string,
): Promise<UserProfile> {
  const query = `
    INSERT INTO user_profiles (auth_user_id)
    VALUES ($1)
    RETURNING id, auth_user_id, first_name, last_name, phone, avatar_url, bio, created_at, updated_at
  `;

  try {
    const result: QueryResult<UserProfile> = await pool.query(query, [
      authUserId,
    ]);
    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
    throw error;
  }
}

export async function getUserProfileByAuthId(
  authUserId: string,
): Promise<UserProfile | null> {
  const query = `
    SELECT id, auth_user_id, first_name, last_name, phone, avatar_url, bio, created_at, updated_at
    FROM user_profiles
    WHERE auth_user_id = $1
  `;

  try {
    const result: QueryResult<UserProfile> = await pool.query(query, [
      authUserId,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
    throw error;
  }
}

export async function updateUserProfile(
  authUserId: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  bio?: string,
): Promise<UserProfile> {
  const query = `
    UPDATE user_profiles
    SET first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        phone = COALESCE($4, phone),
        bio = COALESCE($5, bio)
    WHERE auth_user_id = $1
    RETURNING id, auth_user_id, first_name, last_name, phone, avatar_url, bio, created_at, updated_at
  `;

  try {
    const result: QueryResult<UserProfile> = await pool.query(query, [
      authUserId,
      firstName || null,
      lastName || null,
      phone || null,
      bio || null,
    ]);

    if (result.rows.length === 0) {
      throw new Error("User profile not found");
    }

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
    throw error;
  }
}

// User Address Queries

export async function createUserAddress(
  userId: string,
  streetAddress: string,
  city: string,
  label?: string,
  state?: string,
  postalCode?: string,
  country?: string,
  latitude?: number,
  longitude?: number,
  isDefault?: boolean,
): Promise<UserAddress> {
  const query = `
    INSERT INTO user_addresses (user_id, street_address, city, label, state, postal_code, country, latitude, longitude, is_default)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id, user_id, label, street_address, city, state, postal_code, country, latitude, longitude, is_default, created_at, updated_at
  `;

  try {
    const result: QueryResult<UserAddress> = await pool.query(query, [
      userId,
      streetAddress,
      city,
      label || null,
      state || null,
      postalCode || null,
      country || null,
      latitude || null,
      longitude || null,
      isDefault || false,
    ]);

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create address: ${error.message}`);
    }
    throw error;
  }
}

export async function getUserAddresses(userId: string): Promise<UserAddress[]> {
  const query = `
    SELECT id, user_id, label, street_address, city, state, postal_code, country, latitude, longitude, is_default, created_at, updated_at
    FROM user_addresses
    WHERE user_id = $1
    ORDER BY is_default DESC, created_at DESC
  `;

  try {
    const result: QueryResult<UserAddress> = await pool.query(query, [userId]);
    return result.rows;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get addresses: ${error.message}`);
    }
    throw error;
  }
}

export async function updateUserAddress(
  addressId: string,
  updates: Partial<UserAddress>,
): Promise<UserAddress> {
  const fields: string[] = [];
  const values: any[] = [addressId];
  let paramIndex = 2;

  if (updates.label !== undefined) {
    fields.push(`label = $${paramIndex++}`);
    values.push(updates.label);
  }
  if (updates.street_address !== undefined) {
    fields.push(`street_address = $${paramIndex++}`);
    values.push(updates.street_address);
  }
  if (updates.city !== undefined) {
    fields.push(`city = $${paramIndex++}`);
    values.push(updates.city);
  }
  if (updates.state !== undefined) {
    fields.push(`state = $${paramIndex++}`);
    values.push(updates.state);
  }
  if (updates.postal_code !== undefined) {
    fields.push(`postal_code = $${paramIndex++}`);
    values.push(updates.postal_code);
  }
  if (updates.latitude !== undefined) {
    fields.push(`latitude = $${paramIndex++}`);
    values.push(updates.latitude);
  }
  if (updates.longitude !== undefined) {
    fields.push(`longitude = $${paramIndex++}`);
    values.push(updates.longitude);
  }

  const query = `
    UPDATE user_addresses
    SET ${fields.join(", ")}
    WHERE id = $1
    RETURNING id, user_id, label, street_address, city, state, postal_code, country, latitude, longitude, is_default, created_at, updated_at
  `;

  try {
    const result: QueryResult<UserAddress> = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Address not found");
    }

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update address: ${error.message}`);
    }
    throw error;
  }
}

export async function deleteUserAddress(addressId: string): Promise<boolean> {
  const query = `DELETE FROM user_addresses WHERE id = $1`;

  try {
    const result: QueryResult = await pool.query(query, [addressId]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete address: ${error.message}`);
    }
    throw error;
  }
}

export async function setDefaultAddress(
  userId: string,
  addressId: string,
): Promise<UserAddress> {
  const query = `
    UPDATE user_addresses
    SET is_default = (id = $1)
    WHERE user_id = $2
    RETURNING id, user_id, label, street_address, city, state, postal_code, country, latitude, longitude, is_default, created_at, updated_at
  `;

  try {
    await pool.query(query, [addressId, userId]);

    const getQuery = `
      SELECT id, user_id, label, street_address, city, state, postal_code, country, latitude, longitude, is_default, created_at, updated_at
      FROM user_addresses
      WHERE id = $1
    `;
    const result: QueryResult<UserAddress> = await pool.query(getQuery, [
      addressId,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Address not found");
    }

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to set default address: ${error.message}`);
    }
    throw error;
  }
}
