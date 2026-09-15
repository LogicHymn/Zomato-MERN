import foodModel from "../models/food.model.js";
import storageService from "../services/storage.service.js";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";

//Create Food
async function createFood(req, res) {
    try {
        const {
            name,
            description,
            price,
            category,
            foodType
        } = req.body;

        // Food partner must be logged in
        if (!req.foodPartner) {
            return res.status(401).json({
                message: "Food partner authentication required"
            });
        }

        // Required fields
        if (!name || !description || !price || !category || !foodType) {
            return res.status(400).json({
                message: "Name, description, price, category and food type are required"
            });
        }

        // Validate food type
        if (!["Veg", "Non-Veg"].includes(foodType)) {
            return res.status(400).json({
                message: "Food type must be Veg or Non-Veg"
            });
        }

        // Validate price
        const numericPrice = Number(price);

        if (Number.isNaN(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({
                message: "Price must be a valid positive number"
            });
        }

        // Image is required
        if (!req.files?.image?.[0]) {
            return res.status(400).json({
                message: "Food image is required"
            });
        }

        let imageUrl;
        let videoUrl = "";

        // Upload image
        const imageFile = req.files.image[0];

        const imageUpload = await storageService.uploadFile(
            imageFile,
            `${uuid()}_${imageFile.originalname}`
        );

        if (!imageUpload?.url) {
            return res.status(500).json({
                message: "Failed to upload food image"
            });
        }

        imageUrl = imageUpload.url;

        // Upload video if provided
        if (req.files?.video?.[0]) {
            const videoFile = req.files.video[0];

            const videoUpload = await storageService.uploadFile(
                videoFile,
                `${uuid()}_${videoFile.originalname}`
            );

            if (!videoUpload?.url) {
                return res.status(500).json({
                    message: "Failed to upload food video"
                });
            }

            videoUrl = videoUpload.url;
        }

        // Create food
        const food = await foodModel.create({
            name: name.trim(),
            description: description.trim(),
            price: numericPrice,
            category: category.trim(),
            foodType,
            image: imageUrl,
            video: videoUrl,
            restaurantName: req.foodPartner.restaurantName,
            foodPartner: req.foodPartner._id,
            status: "Available"
        });

        return res.status(201).json({
            message: "Food item created successfully",
            food
        });

    } catch (error) {
        console.error("Error in createFood:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

//Get All food Items
async function getFoodItems(req, res) {
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
        console.error("Error in getFoodItems:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

//Get a food item by ID
async function getFoodItem(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid food item ID"
            });
        }

        const food = await foodModel
            .findById(id)
            .populate(
                "foodPartner",
                "name restaurantName address phone"
            );

        if (!food) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        return res.status(200).json({
            message: "Food item fetched successfully",
            food
        });

    } catch (error) {
        console.error("Error in getFoodItem:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

//Get food Items of a particular partner
async function getPartnerFood(req, res) {
    try {
        if (!req.foodPartner) {
            return res.status(401).json({
                message: "Food partner authentication required"
            });
        }

        const foodItems = await foodModel
            .find({
                foodPartner: req.foodPartner._id
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Partner food items fetched successfully",
            food: foodItems
        });

    } catch (error) {
        console.error("Error in getPartnerFood:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

//Delete a food item by ID
async function deleteFood(req, res) {
    try {
        const { id } = req.params;

        if (!req.foodPartner) {
            return res.status(401).json({
                message: "Food partner authentication required"
            });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid food item ID"
            });
        }

        const food = await foodModel.findOne({
            _id: id,
            foodPartner: req.foodPartner._id
        });

        if (!food) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        await food.deleteOne();

        return res.status(200).json({
            message: "Food item deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteFood:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

//Toggle a food item status
async function toggleFoodStatus(req, res) {
    try {
        const { id } = req.params;

        if (!req.foodPartner) {
            return res.status(401).json({
                message: "Food partner authentication required"
            });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid food item ID"
            });
        }

        const food = await foodModel.findOne({
            _id: id,
            foodPartner: req.foodPartner._id
        });

        if (!food) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        food.status =
            food.status === "Available"
                ? "Unavailable"
                : "Available";

        await food.save();

        return res.status(200).json({
            message: "Food status updated successfully",
            food
        });

    } catch (error) {
        console.error("Error in toggleFoodStatus:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export default {
    createFood,
    getFoodItem,
    getFoodItems,
    getPartnerFood,
    deleteFood,
    toggleFoodStatus
};
