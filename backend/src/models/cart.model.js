import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
            default: 1
        }
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            unique: true
        },
        items: [cartItemSchema]
    },
    { timestamps: true }
);

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
