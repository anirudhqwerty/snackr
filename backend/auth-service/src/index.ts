import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { closePool, initializeDatabase } from "./db/init";
import { errorHandler } from "./middlewares/auth.middleware";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "auth-service",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    service: "auth-service",
    version: "1.0.0",
    description: "Authentication Service for Snackr Platform",
    endpoints: {
      register: "POST /auth/register",
      login: "POST /auth/login",
      logout: "POST /auth/logout",
      refresh: "POST /auth/refresh",
      verify: "GET /auth/verify",
    },
  });
});

// API Routes
app.use("/auth", authRoutes);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[Auth Service] SIGTERM received, shutting down gracefully...");
  await closePool();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[Auth Service] SIGINT received, shutting down gracefully...");
  await closePool();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Start listening
    app.listen(port, () => {
      console.log(`[Auth Service] Running on port ${port}`);
      console.log(
        `[Auth Service] Environment: ${process.env.NODE_ENV || "development"}`,
      );
    });
  } catch (error) {
    console.error("[Auth Service] Failed to start:", error);
    process.exit(1);
  }
}

startServer();
