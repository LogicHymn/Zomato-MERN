import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import foodPartnerModel from "../models/foodPartner.model.js";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import config from "../config/config.js";
import sendEmail from "../services/email.service.js";
import { generateOtp, getOtpExpiry, getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js";


// PASSWORD
async function hashPassword(password) {
    const saltRounds = 12;

    return await bcrypt.hash(password, saltRounds);
}

async function comparePassword(password, storedPassword) {
    return await bcrypt.compare(password, storedPassword);
}

// JWT 

function generateAccessToken(userId, sessionId) {
    return jwt.sign(
        {
            id: userId,
            sessionId
        },
        config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );
}

function generateRefreshToken(userId) {
    return jwt.sign(
        {
            id: userId
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
}

function hashRefreshToken(refreshToken) {
    return crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
}


// COOKIE
function setRefreshTokenCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

// REGISTER
async function registerUser(req, res) {
    try {
        let { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        // Normalize input
        username = username.trim();
        email = email.trim().toLowerCase();

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        // Check existing email
        const existingEmail = await userModel.findOne({ email });

        if (existingEmail) {
            if (existingEmail.verified) {
                return res.status(409).json({
                    message: "Email already exists"
                });
            }

            // Delete previous unverified registration
            await otpModel.deleteMany({
                user: existingEmail._id
            });

            await userModel.findByIdAndDelete(
                existingEmail._id
            );
        }

        // Check existing username
        const existingUsername = await userModel.findOne({
            username
        });

        if (existingUsername) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create unverified user
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            verified: false
        });

        // Generate OTP
        const otp = generateOtp();

        // Hash OTP
        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // OTP expiry
        const expiresAt = getOtpExpiry();

        // Store OTP
        await otpModel.create({
            email,
            user: user._id,
            otpHash,
            expiresAt
        });

        // Generate OTP email
        const html = getOtpHtml(otp);

        // Send OTP
        try {
            await sendEmail(
                email,
                "OTP Verification",
                `Your OTP is ${otp}`,
                html
            );
        } catch (emailErr) {
            console.error(
                "Failed to send OTP email:",
                emailErr.message
            );

            // Cleanup user and OTP
            await otpModel.deleteMany({
                user: user._id
            });

            await userModel.findByIdAndDelete(
                user._id
            );

            return res.status(500).json({
                message:
                    "Failed to send verification email. Please try registering again."
            });
        }

        // Success
        return res.status(201).json({
            message: "User registered. Please verify OTP.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        });

    } catch (err) {
        console.error("Register error:", err);

        // MongoDB duplicate key error
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// LOGIN
async function loginUser(req, res) {
    try {
        const {
            username,
            email,
            password
        } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({
                message: "Username/email and password are required"
            });
        }
        
        if (username) {
            username = username.trim();
        }

        if (email) {
            email = email.trim().toLowerCase();
        }

        const user = await userModel.findOne({
            $or: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : [])
            ]
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        if (!user.verified) {
            return res.status(403).json({
                message: "Please verify your email first"
            });
        }

        // Compare password
        const isPasswordValid =
            await comparePassword(
                password,
                user.password
            );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // Generate refresh token
        const refreshToken = generateRefreshToken(
            user._id
        );

        // Hash refresh token
        const refreshTokenHash =
            hashRefreshToken(refreshToken);

        // Create session
        const session = await sessionModel.create({
            user: user._id,
            refreshToken: refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            revoked: false
        });

        // Generate access token
        const accessToken = generateAccessToken(
            user._id,
            session._id
        );

        // Store refresh token in cookie
        setRefreshTokenCookie(
            res,
            refreshToken
        );

        return res.status(200).json({
            message: "User logged in successfully",

            accessToken,

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// REFRESH TOKEN 
async function refreshToken(req, res) {
    try {
        const currentRefreshToken =
            req.cookies.refreshToken;

        if (!currentRefreshToken) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            currentRefreshToken,
            config.JWT_SECRET
        );

        // Hash current refresh token
        const currentRefreshTokenHash =
            hashRefreshToken(currentRefreshToken);

        // Find session
        const session = await sessionModel.findOne({
            user: decoded.id,
            refreshToken: currentRefreshTokenHash,
            revoked: false
        });

        if (!session) {
            return res.status(401).json({
                message: "Invalid or revoked refresh token"
            });
        }

        // Generate new refresh token
        const newRefreshToken =
            generateRefreshToken(decoded.id);

        // Hash new refresh token
        const newRefreshTokenHash =
            hashRefreshToken(newRefreshToken);

        // Rotate refresh token
        session.refreshToken =
            newRefreshTokenHash;

        await session.save();

        // Generate new access token
        const accessToken = generateAccessToken(
            decoded.id,
            session._id
        );

        // Set new refresh token cookie
        setRefreshTokenCookie(
            res,
            newRefreshToken
        );

        return res.status(200).json({
            message: "Access token refreshed successfully",

            accessToken
        });

    } catch (err) {
        console.error(err);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}

// LOGOUT
async function logoutUser(req, res) {
    try {
        const refreshToken =
            req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token required"
            });
        }

        // Hash refresh token
        const refreshTokenHash =
            hashRefreshToken(refreshToken);

        // Revoke current session
        await sessionModel.updateOne(
            {
                refreshToken: refreshTokenHash
            },
            {
                revoked: true
            }
        );

        // Clear cookies
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/"
        });
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// LOGOUT ALL DEVICES
async function logoutAllDevices(req, res) {
    try {
        const refreshToken =
            req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token not found"
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            config.JWT_SECRET
        );

        // Revoke all sessions of this user
        await sessionModel.updateMany(
            {
                user: decoded.id,
                revoked: false
            },
            {
                revoked: true
            }
        );

        // Clear current device cookies
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/"
        });
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            message: "Logged out from all devices successfully"
        });

    } catch (err) {
        console.error(err);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}

// VERIFY OTP
async function verifyEmail(req, res) {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        // Hash entered OTP
        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // Find OTP
        const otpDoc = await otpModel.findOne({
            email,
            otpHash,
            verified: false
        });

        if (!otpDoc) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // Check expiry
        if (otpDoc.expiresAt < new Date()) {
            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        // If partner OTP verification
        if (otpDoc.partner) {
            const partner = await foodPartnerModel.findByIdAndUpdate(
                otpDoc.partner,
                { isVerified: true },
                { new: true }
            );

            if (!partner) {
                return res.status(404).json({
                    message: "Partner account not found"
                });
            }

            await otpModel.deleteMany({
                partner: otpDoc.partner
            });

            const token = jwt.sign(
                {
                    id: partner._id,
                    role: partner.role || "foodPartner"
                },
                config.JWT_SECRET || process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: "lax",
                path: "/"
            });

            return res.status(200).json({
                message: "Partner email verified successfully",
                role: "partner",
                token,
                foodPartner: {
                    id: partner._id,
                    name: partner.name,
                    email: partner.email,
                    phone: partner.phone,
                    restaurantName: partner.restaurantName,
                    address: partner.address,
                    role: partner.role
                }
            });
        }

        // Verify user
        const user = await userModel.findByIdAndUpdate(
            otpDoc.user,
            {
                verified: true
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Delete OTP
        await otpModel.deleteMany({
            user: otpDoc.user
        });

        // Generate refresh token
        const refreshToken = generateRefreshToken(
            user._id
        );

        // Hash refresh token
        const refreshTokenHash =
            hashRefreshToken(refreshToken);

        // Create session
        const session = await sessionModel.create({
            user: user._id,
            refreshToken: refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
            revoked: false
        });

        // Generate access token
        const accessToken = generateAccessToken(
            user._id,
            session._id
        );

        // Store refresh token in cookie
        setRefreshTokenCookie(
            res,
            refreshToken
        );

        return res.status(200).json({
            message: "Email verified successfully",

            accessToken,

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Register food partner
async function registerFoodPartner(req, res) {
    try {
        const { name, email, password, phone, restaurantName, address } = req.body;

        if (!name || !email || !password || !phone || !restaurantName) {
            return res.status(400).json({
                message: "Name, email, password, phone, and restaurant name are required"
            });
        }

        const isAccountAlreadyExists = await foodPartnerModel.findOne({
            email
        });

        if (isAccountAlreadyExists) {
            if (isAccountAlreadyExists.isVerified) {
                return res.status(400).json({
                    message: "Food partner already exists"
                });
            }
            // Clean up previous unverified registration
            await foodPartnerModel.findByIdAndDelete(isAccountAlreadyExists._id);
            await otpModel.deleteMany({ partner: isAccountAlreadyExists._id });
        }

        const hashedPassword = await hashPassword(password);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            restaurantName,
            address: address || "",
            role: "foodPartner"
        });

        // Generate OTP for partner
        const otp = generateOtp();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        const expiresAt = getOtpExpiry();

        await otpModel.create({
            email,
            partner: foodPartner._id,
            otpHash,
            expiresAt
        });

        // Generate OTP email
        const html = getOtpHtml(otp);
        try {
            await sendEmail(email, "Cravio Partner OTP Verification", `Your Partner OTP is ${otp}`, html);
        } catch (mailErr) {
            console.error("Partner email send failure:", mailErr.message);
            await foodPartnerModel.findByIdAndDelete(foodPartner._id);
            await otpModel.deleteMany({ partner: foodPartner._id });
            return res.status(500).json({
                message: "Failed to send verification email. Please try registering again."
            });
        }

        return res.status(201).json({
            message: "Food partner registered. Please verify OTP.",
            foodPartner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                phone: foodPartner.phone,
                restaurantName: foodPartner.restaurantName,
                address: foodPartner.address,
                role: foodPartner.role
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Login food partner
async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const foodPartner = await foodPartnerModel.findOne({ email });

        if (!foodPartner) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        if (!foodPartner.isVerified) {
            return res.status(403).json({
                message: "Please verify your email first"
            });
        }

        const isPasswordValid = await comparePassword(password, foodPartner.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: foodPartner._id,
                role: foodPartner.role
            },
            config.JWT_SECRET || process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            message: "Food partner logged in successfully",
            foodPartner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                phone: foodPartner.phone,
                restaurantName: foodPartner.restaurantName,
                address: foodPartner.address,
                role: foodPartner.role
            },
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Logout food partner
async function logoutFoodPartner(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            message: "Food partner logged out successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export default {
    registerUser,
    verifyEmail,
    loginUser,
    refreshToken,
    logoutUser,
    logoutAllDevices,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};