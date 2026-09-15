import express from "express";
import orderController from "../controllers/order.controller.js";
import { userAuthMiddleware, foodPartnerAuthMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", userAuthMiddleware, orderController.createOrder);
router.get("/my-orders", userAuthMiddleware, orderController.getUserOrders);
router.get("/partner-orders", foodPartnerAuthMiddleware, orderController.getPartnerOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", foodPartnerAuthMiddleware, orderController.updateOrderStatus);

export default router;
