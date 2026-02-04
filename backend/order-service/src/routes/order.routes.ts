import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { verifyAuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(verifyAuthMiddleware);

// Order management routes
router.post("/", orderController.createOrderHandler);
router.get("/", orderController.getUserOrdersHandler);
router.get("/:id", orderController.getOrderHandler);
router.post("/:id/cancel", orderController.cancelOrderHandler);
router.get("/:id/status", orderController.getOrderStatusHandler);

export default router;
