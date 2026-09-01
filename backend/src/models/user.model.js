import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true
    },

    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"]
    },

    password: {
        type: String,
        required: [true, "password is required"]
    },

    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;

