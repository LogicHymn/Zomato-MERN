import express from "express";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logoutUser);

router.post("/logout-all-devices",authController.logoutAllDevices);

router.post("/verify-otp", authController.verifyEmail);
router.post("/resend-otp", authController.resendOtp);

// Food Partner
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", authController.loginFoodPartner);
router.post("/food-partner/logout", authController.logoutFoodPartner);

// Shorthand aliases
router.post("/partner/register", authController.registerFoodPartner);
router.post("/partner/login", authController.loginFoodPartner);
router.post("/partner/logout", authController.logoutFoodPartner);

export default router;