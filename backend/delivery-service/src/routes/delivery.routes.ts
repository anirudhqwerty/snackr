import { Router } from "express";
import * as deliveryController from "../controllers/delivery.controller";
import { verifyAuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public tracking endpoint
router.get("/:orderId/tracking", deliveryController.getTrackingHandler);
router.get(
  "/:orderId/estimated-arrival",
  deliveryController.getEstimatedArrivalHandler,
);

// Protected endpoints
router.post(
  "/:orderId/rate",
  verifyAuthMiddleware,
  deliveryController.rateDeliveryHandler,
);
router.post(
  "/:orderId/report",
  verifyAuthMiddleware,
  deliveryController.reportIssueHandler,
);

export default router;
