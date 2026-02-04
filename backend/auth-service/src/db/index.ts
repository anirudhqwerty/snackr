import dotenv from "dotenv";
import { Pool, PoolClient } from "pg";

dotenv.config();

// Database configuration from environment variables
const dbConfig = {
  user: process.env.DB_USER || "auth_user",
  password: process.env.DB_PASSWORD || "auth_password",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "auth_db",
};

// Create and export connection pool
export const pool = new Pool(dbConfig);

// Handle pool errors
pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
});

// Test connection on startup
export async function testConnection(): Promise<void> {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log(
      "[Auth DB] Connection successful. Server time:",
      result.rows[0].now,
    );
  } catch (error) {
    console.error("[Auth DB] Connection failed:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Graceful shutdown
export async function closePool(): Promise<void> {
  try {
    await pool.end();
    console.log("[Auth DB] Connection pool closed");
  } catch (error) {
    console.error("[Auth DB] Error closing pool:", error);
  }
}

export default pool;
