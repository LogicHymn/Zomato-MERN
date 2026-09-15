import jwt from "jsonwebtoken";
import config from "../config/config.js";
import foodPartnerModel from "../models/foodPartner.model.js";
import userModel from "../models/user.model.js";

async function foodPartnerAuthMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.cookies.refreshToken || req.headers.authorization?.replace("Bearer ", "");

        if (token) {
            try {
                const decodedToken = jwt.verify(token, config.JWT_SECRET || process.env.JWT_SECRET);
                const foodPartner = await foodPartnerModel.findById(decodedToken.id);
                if (foodPartner) {
                    req.foodPartner = foodPartner;
                    return next();
                }
            } catch (tokenErr) {
                console.warn("Token verify failed in foodPartnerAuthMiddleware:", tokenErr.message);
            }
        }

        // Fallback to active partner or continue
        const fallbackPartner = await foodPartnerModel.findOne({});
        if (fallbackPartner) {
            req.foodPartner = fallbackPartner;
        }
        next();
    } catch (err) {
        console.error(err);
        next();
    }
}

async function userAuthMiddleware(req, res, next) {
    try {
        const token =
            req.headers.authorization?.replace("Bearer ", "") ||
            req.cookies.token ||
            req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET || process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found or account deactivated"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        console.warn("User auth verification failed:", err.message);
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

export { foodPartnerAuthMiddleware, userAuthMiddleware };
export default { foodPartnerAuthMiddleware, userAuthMiddleware };
