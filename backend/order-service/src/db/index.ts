import dotenv from "dotenv";
import { Pool, PoolClient } from "pg";

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || "order_user",
  password: process.env.DB_PASSWORD || "order_password",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "order_db",
};

export const pool = new Pool(dbConfig);

pool.on("error", (err: Error) => {
  console.error("[Order DB] Unexpected error on idle client", err);
});

export async function testConnection(): Promise<void> {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log(
      "[Order DB] Connection successful. Server time:",
      result.rows[0].now,
    );
  } catch (error) {
    console.error("[Order DB] Connection failed:", error);
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
    console.log("[Order DB] Connection pool closed");
  } catch (error) {
    console.error("[Order DB] Error closing pool:", error);
  }
}

export default pool;
