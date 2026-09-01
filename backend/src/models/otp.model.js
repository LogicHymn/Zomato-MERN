import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"]
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },

        otpHash: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        },

        verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const otpModel = mongoose.model("OTP", otpSchema);

export default otpModel;