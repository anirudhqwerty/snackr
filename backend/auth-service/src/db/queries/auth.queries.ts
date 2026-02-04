import { QueryResult } from "pg";
import { pool } from "../index";

/**
 * TypeScript interface for auth_users table
 */
export interface AuthUser {
  id: string;
  email: string;
  password_hash: string;
  role: "customer" | "vendor" | "delivery";
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Create a new auth user in the database
 *
 * @param email - User email (must be unique)
 * @param passwordHash - Hashed password
 * @param role - User role (customer, vendor, or delivery)
 * @returns The created user object with generated ID
 * @throws Error if email already exists or database error occurs
 */
export async function createAuthUser(
  email: string,
  passwordHash: string,
  role: "customer" | "vendor" | "delivery" = "customer",
): Promise<AuthUser> {
  const query = `
    INSERT INTO auth_users (email, password_hash, role)
    VALUES ($1, $2, $3)
    RETURNING id, email, password_hash, role, is_active, created_at, updated_at
  `;

  try {
    const result: QueryResult<AuthUser> = await pool.query(query, [
      email,
      passwordHash,
      role,
    ]);
    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        throw new Error(`Email '${email}' already exists`);
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Find a user by email address
 *
 * @param email - User email to search for
 * @returns User object if found, null if not found
 * @throws Error if database error occurs
 */
export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  const query = `
    SELECT id, email, password_hash, role, is_active, created_at, updated_at
    FROM auth_users
    WHERE email = $1
  `;

  try {
    const result: QueryResult<AuthUser> = await pool.query(query, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Find a user by ID
 *
 * @param id - User UUID
 * @returns User object if found, null if not found
 * @throws Error if database error occurs
 */
export async function findUserById(id: string): Promise<AuthUser | null> {
  const query = `
    SELECT id, email, password_hash, role, is_active, created_at, updated_at
    FROM auth_users
    WHERE id = $1
  `;

  try {
    const result: QueryResult<AuthUser> = await pool.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to find user by id: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Deactivate a user account
 *
 * @param id - User UUID
 * @returns The deactivated user object
 * @throws Error if user not found or database error occurs
 */
export async function deactivateUser(id: string): Promise<AuthUser> {
  const query = `
    UPDATE auth_users
    SET is_active = false
    WHERE id = $1
    RETURNING id, email, password_hash, role, is_active, created_at, updated_at
  `;

  try {
    const result: QueryResult<AuthUser> = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new Error(`User with id '${id}' not found`);
    }

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Find all active users (paginated)
 *
 * @param limit - Number of records to return (default: 10)
 * @param offset - Number of records to skip (default: 0)
 * @returns Array of active user objects
 * @throws Error if database error occurs
 */
export async function findActiveUsers(
  limit: number = 10,
  offset: number = 0,
): Promise<AuthUser[]> {
  const query = `
    SELECT id, email, password_hash, role, is_active, created_at, updated_at
    FROM auth_users
    WHERE is_active = true
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  try {
    const result: QueryResult<AuthUser> = await pool.query(query, [
      limit,
      offset,
    ]);
    return result.rows;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to find active users: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Update user password hash (soft update, doesn't validate current password)
 *
 * @param id - User UUID
 * @param newPasswordHash - New hashed password
 * @returns The updated user object
 * @throws Error if user not found or database error occurs
 */
export async function updateUserPasswordHash(
  id: string,
  newPasswordHash: string,
): Promise<AuthUser> {
  const query = `
    UPDATE auth_users
    SET password_hash = $1
    WHERE id = $2
    RETURNING id, email, password_hash, role, is_active, created_at, updated_at
  `;

  try {
    const result: QueryResult<AuthUser> = await pool.query(query, [
      newPasswordHash,
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error(`User with id '${id}' not found`);
    }

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update password: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Count total number of active users
 *
 * @returns Count of active users
 * @throws Error if database error occurs
 */
export async function countActiveUsers(): Promise<number> {
  const query = `
    SELECT COUNT(*) as count
    FROM auth_users
    WHERE is_active = true
  `;

  try {
    const result: QueryResult<{ count: string }> = await pool.query(query);
    return parseInt(result.rows[0].count, 10);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to count active users: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Delete a user by ID (permanent deletion)
 * WARNING: Use with caution - this is a hard delete
 *
 * @param id - User UUID
 * @returns true if user was deleted, false if user not found
 * @throws Error if database error occurs
 */
export async function deleteUserById(id: string): Promise<boolean> {
  const query = `
    DELETE FROM auth_users
    WHERE id = $1
  `;

  try {
    const result: QueryResult = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
    throw error;
  }
}
