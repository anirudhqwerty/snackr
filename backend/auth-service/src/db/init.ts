import fs from "fs";
import path from "path";
import { closePool, pool, testConnection } from "./index";

/**
 * Initialize the database by running all migrations
 * This function should be called during application startup
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log("[Auth DB] Testing connection...");
    await testConnection();

    console.log("[Auth DB] Running migrations...");
    await runMigrations();

    console.log("[Auth DB] Database initialization complete ✓");
  } catch (error) {
    console.error("[Auth DB] Initialization failed:", error);
    throw error;
  }
}

/**
 * Read and execute all migration files in sequential order
 */
async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, "migrations");

  // Get all SQL files and sort them numerically
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"));
  files.sort();

  if (files.length === 0) {
    console.log("[Auth DB] No migrations to run");
    return;
  }

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    try {
      console.log(`[Auth DB] Running migration: ${file}`);
      await pool.query(sql);
      console.log(`[Auth DB] Migration completed: ${file} ✓`);
    } catch (error: unknown) {
      // If error is about already existing objects, continue (idempotent)
      if (error instanceof Error && error.message.includes("already exists")) {
        console.log(`[Auth DB] Migration skipped (already exists): ${file}`);
      } else {
        throw error;
      }
    }
  }
}

/**
 * Drop all tables (for testing/development only)
 * WARNING: This will delete all data
 */
export async function dropAllTables(): Promise<void> {
  const query = `
    DROP TRIGGER IF EXISTS auth_users_updated_at_trigger ON auth_users;
    DROP FUNCTION IF EXISTS update_auth_users_updated_at();
    DROP TABLE IF EXISTS auth_users;
    DROP TYPE IF EXISTS user_role;
  `;

  try {
    await pool.query(query);
    console.log("[Auth DB] All tables dropped ✓");
  } catch (error) {
    console.error("[Auth DB] Failed to drop tables:", error);
    throw error;
  }
}

/**
 * Reset database (drop all, then re-initialize)
 * WARNING: This will delete all data
 */
export async function resetDatabase(): Promise<void> {
  try {
    console.log("[Auth DB] Resetting database...");
    await dropAllTables();
    await initializeDatabase();
    console.log("[Auth DB] Database reset complete ✓");
  } catch (error) {
    console.error("[Auth DB] Reset failed:", error);
    throw error;
  }
}

// Export close pool for graceful shutdown
export { closePool };
