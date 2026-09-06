import mongoose from "mongoose";

const foodPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "foodPartner"
    },

    restaurantName: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

const foodPartnerModel = mongoose.model("FoodPartner", foodPartnerSchema);

export default foodPartnerModel;