import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { closePool, initializeDatabase } from "./db/init";
import { errorHandler } from "./middlewares/auth.middleware";
import orderRoutes from "./routes/order.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "order-service",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    service: "order-service",
    version: "1.0.0",
    description: "Order Service for Snackr Platform",
    endpoints: {
      create: "POST /orders",
      list: "GET /orders",
      get: "GET /orders/:id",
      cancel: "POST /orders/:id/cancel",
      status: "GET /orders/:id/status",
    },
  });
});

// API Routes
app.use("/orders", orderRoutes);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("[Order Service] SIGTERM received, shutting down gracefully...");
  await closePool();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("[Order Service] SIGINT received, shutting down gracefully...");
  await closePool();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`[Order Service] Running on port ${port}`);
      console.log(
        `[Order Service] Environment: ${process.env.NODE_ENV || "development"}`,
      );
    });
  } catch (error) {
    console.error("[Order Service] Failed to start:", error);
    process.exit(1);
  }
}

startServer();
