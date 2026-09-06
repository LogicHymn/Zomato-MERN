import foodModel from "../models/food.model.js";
import storageService from "../services/storage.service.js";
import { v4 as uuid } from "uuid";

async function createFood(req, res) {
    try {
        const { name, description, price, category, image, video, restaurantName } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                message: "Name and price are required"
            });
        }

        let imageUrl = image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
        let videoUrl = video || "";

        // If files were uploaded via multer and ImageKit is configured
        if (req.files?.image?.[0]) {
            try {
                const imageFile = req.files.image[0];
                const uploadRes = await storageService.uploadFile(
                    imageFile,
                    `${uuid()}_${imageFile.originalname || "image.jpg"}`
                );
                if (uploadRes?.url) imageUrl = uploadRes.url;
            } catch (err) {
                console.warn("ImageKit image upload failed, using default/provided image:", err.message);
            }
        }

        if (req.files?.video?.[0]) {
            try {
                const videoFile = req.files.video[0];
                const uploadRes = await storageService.uploadFile(
                    videoFile,
                    `${uuid()}_${videoFile.originalname || "video.mp4"}`
                );
                if (uploadRes?.url) videoUrl = uploadRes.url;
            } catch (err) {
                console.warn("ImageKit video upload failed:", err.message);
            }
        }

        const partnerId = req.foodPartner?._id || undefined;
        const restName = restaurantName || req.foodPartner?.restaurantName || "Cravio Partner Kitchen";

        // Save to MongoDB
        const foodItem = await foodModel.create({
            name: name.trim(),
            description: description ? description.trim() : "Freshly prepared chef specialty.",
            price: Number(price),
            category: category || "General",
            image: imageUrl,
            video: videoUrl,
            restaurantName: restName,
            status: "Available",
            foodPartner: partnerId
        });

        return res.status(201).json({
            message: "Food item created successfully",
            food: foodItem
        });
    } catch (error) {
        console.error("Error in createFood:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function getFoodItem(req, res) {
    try {
        const foodItems = await foodModel
            .find({})
            .populate("foodPartner", "name restaurantName address phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Food items fetched successfully",
            food: foodItems
        });
    } catch (error) {
        console.error("Error in getFoodItem:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function deleteFood(req, res) {
    try {
        const { id } = req.params;
        await foodModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
        console.error("Error in deleteFood:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function toggleFoodStatus(req, res) {
    try {
        const { id } = req.params;
        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }
        food.status = food.status === "Available" ? "Unavailable" : "Available";
        await food.save();
        return res.status(200).json({ message: "Status updated successfully", food });
    } catch (error) {
        console.error("Error in toggleFoodStatus:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    createFood,
    getFoodItem,
    deleteFood,
    toggleFoodStatus
};
