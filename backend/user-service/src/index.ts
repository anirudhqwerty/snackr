import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { closePool, initializeDatabase } from "./db/init";
import { errorHandler } from "./middlewares/auth.middleware";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "user-service",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    service: "user-service",
    version: "1.0.0",
    description: "User Service for Snackr Platform",
    endpoints: {
      getMe: "GET /users/me",
      updateMe: "PUT /users/me",
      getAddresses: "GET /users/addresses",
      createAddress: "POST /users/addresses",
      updateAddress: "PUT /users/addresses/:id",
      deleteAddress: "DELETE /users/addresses/:id",
      setDefault: "POST /users/addresses/:id/default",
    },
  });
});

// API Routes
app.use("/users", userRoutes);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[User Service] SIGTERM received, shutting down gracefully...");
  await closePool();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[User Service] SIGINT received, shutting down gracefully...");
  await closePool();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`[User Service] Running on port ${port}`);
      console.log(
        `[User Service] Environment: ${process.env.NODE_ENV || "development"}`,
      );
    });
  } catch (error) {
    console.error("[User Service] Failed to start:", error);
    process.exit(1);
  }
}

startServer();
