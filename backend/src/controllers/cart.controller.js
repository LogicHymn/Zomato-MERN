import cartModel from "../models/cart.model.js";
import foodModel from "../models/food.model.js";
import mongoose from "mongoose";

// Helper to compute subtotal and total count
function computeCartTotals(items) {
    let subtotal = 0;
    let totalItems = 0;

    for (const item of items) {
        if (item.food && typeof item.food.price === "number") {
            subtotal += item.food.price * item.quantity;
            totalItems += item.quantity;
        }
    }

    return { subtotal, totalItems };
}

// Get user cart
async function getCart(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        let cart = await cartModel.findOne({ user: req.user._id }).populate({
            path: "items.food",
            populate: {
                path: "foodPartner",
                select: "name restaurantName address phone"
            }
        });

        if (!cart) {
            cart = await cartModel.create({
                user: req.user._id,
                items: []
            });
        }

        const { subtotal, totalItems } = computeCartTotals(cart.items);

        return res.status(200).json({
            message: "Cart fetched successfully",
            cart,
            subtotal,
            totalItems
        });
    } catch (error) {
        console.error("Error in getCart:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Add item to cart
async function addToCart(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const { foodId, quantity = 1 } = req.body;

        if (!foodId || !mongoose.isValidObjectId(foodId)) {
            return res.status(400).json({
                message: "Valid foodId is required"
            });
        }

        const qty = Number(quantity);
        if (Number.isNaN(qty) || qty <= 0) {
            return res.status(400).json({
                message: "Quantity must be a positive number"
            });
        }

        // Verify food item exists
        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        let cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            cart = new cartModel({
                user: req.user._id,
                items: []
            });
        }

        const existingIndex = cart.items.findIndex(
            (item) => item.food.toString() === foodId.toString()
        );

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += qty;
        } else {
            cart.items.push({
                food: foodId,
                quantity: qty
            });
        }

        await cart.save();

        const populatedCart = await cartModel.findById(cart._id).populate({
            path: "items.food",
            populate: {
                path: "foodPartner",
                select: "name restaurantName address phone"
            }
        });

        const { subtotal, totalItems } = computeCartTotals(populatedCart.items);

        return res.status(200).json({
            message: "Item added to cart successfully",
            cart: populatedCart,
            subtotal,
            totalItems
        });
    } catch (error) {
        console.error("Error in addToCart:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Update cart item quantity
async function updateCartItem(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const { foodId, quantity } = req.body;

        if (!foodId || !mongoose.isValidObjectId(foodId)) {
            return res.status(400).json({
                message: "Valid foodId is required"
            });
        }

        const qty = Number(quantity);
        if (Number.isNaN(qty)) {
            return res.status(400).json({
                message: "Valid quantity number is required"
            });
        }

        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        if (qty <= 0) {
            // Remove item if quantity <= 0
            cart.items = cart.items.filter(
                (item) => item.food.toString() !== foodId.toString()
            );
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.food.toString() === foodId.toString()
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = qty;
            } else {
                return res.status(404).json({
                    message: "Item not found in cart"
                });
            }
        }

        await cart.save();

        const populatedCart = await cartModel.findById(cart._id).populate({
            path: "items.food",
            populate: {
                path: "foodPartner",
                select: "name restaurantName address phone"
            }
        });

        const { subtotal, totalItems } = computeCartTotals(populatedCart.items);

        return res.status(200).json({
            message: "Cart updated successfully",
            cart: populatedCart,
            subtotal,
            totalItems
        });
    } catch (error) {
        console.error("Error in updateCartItem:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Remove item from cart
async function removeFromCart(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const foodId = req.params.foodId || req.body.foodId;

        if (!foodId || !mongoose.isValidObjectId(foodId)) {
            return res.status(400).json({
                message: "Valid foodId is required"
            });
        }

        const cart = await cartModel.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            (item) => item.food.toString() !== foodId.toString()
        );

        await cart.save();

        const populatedCart = await cartModel.findById(cart._id).populate({
            path: "items.food",
            populate: {
                path: "foodPartner",
                select: "name restaurantName address phone"
            }
        });

        const { subtotal, totalItems } = computeCartTotals(populatedCart.items);

        return res.status(200).json({
            message: "Item removed from cart",
            cart: populatedCart,
            subtotal,
            totalItems
        });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Clear cart
async function clearCart(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const cart = await cartModel.findOne({ user: req.user._id });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(200).json({
            message: "Cart cleared successfully",
            cart: cart || { items: [] },
            subtotal: 0,
            totalItems: 0
        });
    } catch (error) {
        console.error("Error in clearCart:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
