import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { verifyAuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(verifyAuthMiddleware);

// User profile routes
router.get("/me", userController.getCurrentUserHandler);
router.put("/me", userController.updateCurrentUserHandler);

// Address routes
router.get("/addresses", userController.getUserAddressesHandler);
router.post("/addresses", userController.createUserAddressHandler);
router.put("/addresses/:id", userController.updateUserAddressHandler);
router.delete("/addresses/:id", userController.deleteUserAddressHandler);
router.post("/addresses/:id/default", userController.setDefaultAddressHandler);

export default router;
