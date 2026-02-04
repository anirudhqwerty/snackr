import fs from "fs";
import path from "path";
import { closePool, pool, testConnection } from "./index";

export async function initializeDatabase(): Promise<void> {
  try {
    console.log("[Delivery DB] Testing connection...");
    await testConnection();

    console.log("[Delivery DB] Running migrations...");
    await runMigrations();

    console.log("[Delivery DB] Database initialization complete ✓");
  } catch (error) {
    console.error("[Delivery DB] Initialization failed:", error);
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
    console.log("[Delivery DB] No migrations to run");
    return;
  }

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    try {
      console.log(`[Delivery DB] Running migration: ${file}`);
      await pool.query(sql);
      console.log(`[Delivery DB] Migration completed: ${file} ✓`);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("already exists")) {
        console.log(
          `[Delivery DB] Migration skipped (already exists): ${file}`,
        );
      } else {
        throw error;
      }
    }
  }
}

export { closePool };
