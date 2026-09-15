import express from "express";
import cartController from "../controllers/cart.controller.js";
import { userAuthMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", userAuthMiddleware, cartController.getCart);
router.post("/add", userAuthMiddleware, cartController.addToCart);
router.put("/update", userAuthMiddleware, cartController.updateCartItem);
router.delete("/remove/:foodId", userAuthMiddleware, cartController.removeFromCart);
router.delete("/clear", userAuthMiddleware, cartController.clearCart);

export default router;
