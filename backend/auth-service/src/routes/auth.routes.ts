import { Router } from "express";
import {
    loginHandler,
    logoutHandler,
    refreshHandler,
    registerHandler,
    verifyHandler,
} from "../controllers/auth.controller";
import { verifyJWTMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * Public routes
 */
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/refresh", refreshHandler);
router.get("/verify", verifyHandler); // Can be public to check token validity

/**
 * Protected routes
 */
router.post("/logout", verifyJWTMiddleware, logoutHandler);

export default router;
