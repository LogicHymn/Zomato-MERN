import express from "express";
import foodController from "../controllers/food.controller.js";
import { foodPartnerAuthMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// POST /api/food/ [protected]
router.post("/", foodPartnerAuthMiddleware, upload.fields([{ name: "video", maxCount: 1 }, { name: "image", maxCount: 1 }]), foodController.createFood);

router.get("/", foodController.getFoodItem);
router.delete("/:id", foodPartnerAuthMiddleware, foodController.deleteFood);
router.patch("/:id/status", foodPartnerAuthMiddleware, foodController.toggleFoodStatus);

export default router;

