import orderModel from "../models/order.model.js";
import cartModel from "../models/cart.model.js";
import foodModel from "../models/food.model.js";
import mongoose from "mongoose";

// Create a new order
async function createOrder(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const {
            items: requestedItems,
            deliveryAddress,
            paymentMethod = "COD"
        } = req.body;

        let orderItems = [];

        // If items are provided in req.body, use them; otherwise fetch from user's active cart
        if (Array.isArray(requestedItems) && requestedItems.length > 0) {
            for (const item of requestedItems) {
                const foodId = item.foodId || item.food?._id || item.food;
                if (!foodId || !mongoose.isValidObjectId(foodId)) continue;

                const food = await foodModel.findById(foodId);
                if (!food) continue;

                const qty = Math.max(1, Number(item.quantity) || 1);
                orderItems.push({
                    food: food._id,
                    name: food.name,
                    price: food.price,
                    quantity: qty,
                    image: food.image || "",
                    foodType: food.foodType || "Veg",
                    foodPartner: food.foodPartner
                });
            }
        } else {
            // Fetch from user's active cart
            const cart = await cartModel.findOne({ user: req.user._id }).populate("items.food");

            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(400).json({
                    message: "Cart is empty. Add dishes before placing an order."
                });
            }

            for (const item of cart.items) {
                if (!item.food) continue;
                orderItems.push({
                    food: item.food._id,
                    name: item.food.name,
                    price: item.food.price,
                    quantity: item.quantity,
                    image: item.food.image || "",
                    foodType: item.food.foodType || "Veg",
                    foodPartner: item.food.foodPartner
                });
            }
        }

        if (orderItems.length === 0) {
            return res.status(400).json({
                message: "No valid items found to place an order."
            });
        }

        // Calculate bill breakdown safely from verified database prices
        const subtotal = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const deliveryFee = subtotal > 0 ? 40 : 0;
        const taxes = Math.round(subtotal * 0.05);
        const totalAmount = subtotal + deliveryFee + taxes;

        // Parse delivery address
        const formattedAddress = {
            house: deliveryAddress?.house || "",
            street: deliveryAddress?.street || "",
            city: deliveryAddress?.city || "",
            state: deliveryAddress?.state || "",
            pincode: deliveryAddress?.pincode || "",
            phone: deliveryAddress?.phone || req.user.phone || ""
        };

        const order = await orderModel.create({
            user: req.user._id,
            items: orderItems,
            subtotal,
            deliveryFee,
            taxes,
            totalAmount,
            deliveryAddress: formattedAddress,
            paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
            orderStatus: "Placed"
        });

        // Clear user's cart after successful order creation
        await cartModel.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [] } }
        );

        return res.status(201).json({
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        console.error("Error in createOrder:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Get all orders placed by the current user
async function getUserOrders(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const orders = await orderModel
            .find({ user: req.user._id })
            .populate("items.foodPartner", "name restaurantName phone address")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "User orders fetched successfully",
            orders
        });
    } catch (error) {
        console.error("Error in getUserOrders:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Get single order by ID
async function getOrderById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await orderModel
            .findById(id)
            .populate("user", "username email phone")
            .populate("items.foodPartner", "name restaurantName phone address");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Authorize: must be the customer who placed the order or a food partner
        const isCustomer = req.user && order.user._id.toString() === req.user._id.toString();
        const isPartner = req.foodPartner && order.items.some(
            (item) => item.foodPartner && item.foodPartner._id.toString() === req.foodPartner._id.toString()
        );

        if (!isCustomer && !isPartner) {
            return res.status(403).json({
                message: "Access denied to this order"
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully",
            order
        });
    } catch (error) {
        console.error("Error in getOrderById:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Get orders received by a food partner
async function getPartnerOrders(req, res) {
    try {
        if (!req.foodPartner) {
            return res.status(401).json({
                message: "Food partner authentication required"
            });
        }

        const orders = await orderModel
            .find({
                "items.foodPartner": req.foodPartner._id
            })
            .populate("user", "username email phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Partner orders fetched successfully",
            orders
        });
    } catch (error) {
        console.error("Error in getPartnerOrders:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Update order status (Partner or Delivery)
async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const validStatuses = ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Status must be one of: ${validStatuses.join(", ")}`
            });
        }

        const order = await orderModel.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check permission if partner
        if (req.foodPartner) {
            const belongsToPartner = order.items.some(
                (item) => item.foodPartner && item.foodPartner.toString() === req.foodPartner._id.toString()
            );

            if (!belongsToPartner) {
                return res.status(403).json({
                    message: "Access denied to update this order"
                });
            }
        }

        order.orderStatus = status;
        if (status === "Delivered" && order.paymentMethod === "COD") {
            order.paymentStatus = "Paid";
        }
        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export {
    createOrder,
    getUserOrders,
    getOrderById,
    getPartnerOrders,
    updateOrderStatus
};

export default {
    createOrder,
    getUserOrders,
    getOrderById,
    getPartnerOrders,
    updateOrderStatus
};
