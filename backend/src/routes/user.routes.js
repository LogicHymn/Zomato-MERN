import express from "express";
import userController from "../controllers/user.controller.js";
import { userAuthMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", userAuthMiddleware, userController.getProfile);
router.put("/profile", userAuthMiddleware, userController.updateProfile);
router.put("/change-password", userAuthMiddleware, userController.changePassword);

export default router;
