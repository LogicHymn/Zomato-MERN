import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        image: {
            type: String,
            default: ""
        },
        foodType: {
            type: String,
            default: "Veg"
        },
        foodPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodPartner"
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        items: [orderItemSchema],
        subtotal: {
            type: Number,
            required: true
        },
        deliveryFee: {
            type: Number,
            default: 40
        },
        taxes: {
            type: Number,
            default: 0
        },
        totalAmount: {
            type: Number,
            required: true
        },
        deliveryAddress: {
            house: { type: String, default: "" },
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            pincode: { type: String, default: "" },
            phone: { type: String, default: "" }
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "Card", "UPI", "NetBanking"],
            default: "COD"
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
        },
        orderStatus: {
            type: String,
            enum: ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
            default: "Placed"
        }
    },
    { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
