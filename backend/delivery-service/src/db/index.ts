import dotenv from "dotenv";
import { Pool, PoolClient } from "pg";

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || "delivery_user",
  password: process.env.DB_PASSWORD || "delivery_password",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "delivery_db",
};

export const pool = new Pool(dbConfig);

pool.on("error", (err: Error) => {
  console.error("[Delivery DB] Unexpected error on idle client", err);
});

export async function testConnection(): Promise<void> {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log(
      "[Delivery DB] Connection successful. Server time:",
      result.rows[0].now,
    );
  } catch (error) {
    console.error("[Delivery DB] Connection failed:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function closePool(): Promise<void> {
  try {
    await pool.end();
    console.log("[Delivery DB] Connection pool closed");
  } catch (error) {
    console.error("[Delivery DB] Error closing pool:", error);
  }
}

export default pool;
