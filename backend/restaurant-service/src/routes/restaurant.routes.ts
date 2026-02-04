import { Router } from "express";
import * as restaurantController from "../controllers/restaurant.controller";
import { verifyAuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", restaurantController.listRestaurantsHandler);
router.get("/search", restaurantController.searchHandler);
router.get("/:id", restaurantController.getRestaurantHandler);
router.get("/:id/menu", restaurantController.getMenuHandler);
router.get("/:id/reviews", restaurantController.getReviewsHandler);

// Protected routes
router.post(
  "/:id/reviews",
  verifyAuthMiddleware,
  restaurantController.createReviewHandler,
);

export default router;
