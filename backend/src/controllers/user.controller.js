import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";

// Get user profile
async function getProfile(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const user = await userModel.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        });
    } catch (error) {
        console.error("Error in getProfile:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Update user profile
async function updateProfile(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const { name, phone, address, username } = req.body;
        const updates = {};

        if (name !== undefined) updates.name = name.trim();
        if (phone !== undefined) updates.phone = phone.trim();
        if (address !== undefined) updates.address = typeof address === "object" ? JSON.stringify(address) : address.trim();

        if (username !== undefined) {
            const trimmedUsername = username.trim();
            if (trimmedUsername.length < 3) {
                return res.status(400).json({
                    message: "Username must be at least 3 characters long"
                });
            }

            // Check if username is already taken by another user
            const existing = await userModel.findOne({
                username: trimmedUsername,
                _id: { $ne: req.user._id }
            });

            if (existing) {
                return res.status(409).json({
                    message: "Username already taken"
                });
            }

            updates.username = trimmedUsername;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Change user password
async function changePassword(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message: "New password must be at least 8 characters long"
            });
        }

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect current password"
            });
        }

        const saltRounds = 12;
        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Error in changePassword:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export {
    getProfile,
    updateProfile,
    changePassword
};

export default {
    getProfile,
    updateProfile,
    changePassword
};
