import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        video: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        },
        category: {
            type: String,
            default: "General",
        },
        status: {
            type: String,
            default: "Available",
        },
        restaurantName: {
            type: String,
            default: "Cravio Partner Kitchen",
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        review: {
            type: String,
            default: "0",
        },
        foodPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodPartner",
            required: false,
        }
    },
    { timestamps: true }
);

const foodModel = mongoose.model("Food", foodSchema);

export default foodModel;
