import fs from "fs";
import path from "path";
import { closePool, pool, testConnection } from "./index";

export async function initializeDatabase(): Promise<void> {
  try {
    console.log("[Order DB] Testing connection...");
    await testConnection();

    console.log("[Order DB] Running migrations...");
    await runMigrations();

    console.log("[Order DB] Database initialization complete ✓");
  } catch (error) {
    console.error("[Order DB] Initialization failed:", error);
    throw error;
  }
}

async function runMigrations(): Promise<void> {
  const migrationsDir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"));
  files.sort();

  if (files.length === 0) {
    console.log("[Order DB] No migrations to run");
    return;
  }

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    try {
      console.log(`[Order DB] Running migration: ${file}`);
      await pool.query(sql);
      console.log(`[Order DB] Migration completed: ${file} ✓`);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("already exists")) {
        console.log(`[Order DB] Migration skipped (already exists): ${file}`);
      } else {
        throw error;
      }
    }
  }
}

export { closePool };
