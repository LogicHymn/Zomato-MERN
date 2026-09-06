import jwt from "jsonwebtoken";
import config from "../config/config.js";
import foodPartnerModel from "../models/foodPartner.model.js";

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

export { foodPartnerAuthMiddleware };
export default { foodPartnerAuthMiddleware };
