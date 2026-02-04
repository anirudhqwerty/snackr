import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { closePool, initializeDatabase } from "./db/init";
import { errorHandler } from "./middlewares/auth.middleware";
import restaurantRoutes from "./routes/restaurant.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "restaurant-service",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    service: "restaurant-service",
    version: "1.0.0",
    description: "Restaurant Service for Snackr Platform",
    endpoints: {
      list: "GET /restaurants",
      get: "GET /restaurants/:id",
      menu: "GET /restaurants/:id/menu",
      search: "GET /restaurants/search?q=query",
      reviews: "GET /restaurants/:id/reviews",
      createReview: "POST /restaurants/:id/reviews",
    },
  });
});

// API Routes
app.use("/restaurants", restaurantRoutes);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log(
    "[Restaurant Service] SIGTERM received, shutting down gracefully...",
  );
  await closePool();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log(
    "[Restaurant Service] SIGINT received, shutting down gracefully...",
  );
  await closePool();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`[Restaurant Service] Running on port ${port}`);
      console.log(
        `[Restaurant Service] Environment: ${process.env.NODE_ENV || "development"}`,
      );
    });
  } catch (error) {
    console.error("[Restaurant Service] Failed to start:", error);
    process.exit(1);
  }
}

startServer();
