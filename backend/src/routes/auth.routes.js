import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logoutUser);

router.post("/logout-all-devices",authController.logoutAllDevices);

router.post("/verify-otp", authController.verifyEmail);

export default router;