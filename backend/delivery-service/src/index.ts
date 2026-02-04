import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { closePool, initializeDatabase } from "./db/init";
import { errorHandler } from "./middlewares/auth.middleware";
import deliveryRoutes from "./routes/delivery.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "delivery-service",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    service: "delivery-service",
    version: "1.0.0",
    description: "Delivery Service for Snackr Platform",
    endpoints: {
      tracking: "GET /delivery/:orderId/tracking",
      rate: "POST /delivery/:orderId/rate",
      report: "POST /delivery/:orderId/report",
      estimatedArrival: "GET /delivery/:orderId/estimated-arrival",
    },
  });
});

// API Routes
app.use("/delivery", deliveryRoutes);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log(
    "[Delivery Service] SIGTERM received, shutting down gracefully...",
  );
  await closePool();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log(
    "[Delivery Service] SIGINT received, shutting down gracefully...",
  );
  await closePool();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`[Delivery Service] Running on port ${port}`);
      console.log(
        `[Delivery Service] Environment: ${process.env.NODE_ENV || "development"}`,
      );
    });
  } catch (error) {
    console.error("[Delivery Service] Failed to start:", error);
    process.exit(1);
  }
}

startServer();
