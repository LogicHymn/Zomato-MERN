import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import foodPartnerModel from "../models/foodPartner.model.js";
import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import config from "../config/config.js";
import sendEmail from "../services/email.service.js";
import { generateOtp, getOtpExpiry, getOtpHtml } from "../utils/utils.js";
import otpModel from "../models/otp.model.js"

const scryptAsync = promisify(crypto.scrypt);


// PASSWORD 

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");

    const derivedKey = await scryptAsync(
        password,
        salt,
        64
    );

    return `${salt}:${derivedKey.toString("hex")}`;
}

async function comparePassword(password, storedPassword) {
    const [salt, storedHash] = storedPassword.split(":");

    if (!salt || !storedHash) {
        return false;
    }

    const derivedKey = await scryptAsync(
        password,
        salt,
        64
    );

    const storedHashBuffer = Buffer.from(
        storedHash,
        "hex"
    );

    if (storedHashBuffer.length !== derivedKey.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        storedHashBuffer,
        derivedKey
    );
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
        secure: false, // true in production with HTTPS
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

// REGISTER

async function registerUser(req, res) {
    try {
        const {
            username,
            email,
            password
        } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email and password are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const existingUser = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        // Hash password
        const hash = await hashPassword(password);

        // Create unverified user
        const user = await userModel.create({
            username,
            email,
            password: hash,
            verified: false
        });

        // Generate OTP
        const otp = generateOtp();

        // Hash OTP
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        // OTP expiry - 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Store OTP hash
        await otpModel.create({
            email,
            user: user._id,
            otpHash,
            expiresAt
        });

        // Generate OTP email
        const html = getOtpHtml(otp);

        // Send OTP
        await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`, html);

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
        console.error(err);

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
            secure: false,
            sameSite: "lax",
            path: "/"
        });
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
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
            secure: false,
            sameSite: "lax",
            path: "/"
        });
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
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
                config.JWT_SECRET || process.env.JWT_SECRET
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
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

        if (!name || !email || !password || !phone || !restaurantName || !address) {
            return res.status(400).json({
                message: "Name, email, password, phone, restaurant name and address are required"
            });
        }

        const isAccountAlreadyExists = await foodPartnerModel.findOne({
            email
        });

        if (isAccountAlreadyExists) {
            return res.status(400).json({
                message: "Food partner already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            restaurantName,
            address,
            role: "foodPartner"
        });

        // Generate OTP for partner
        const otp = generateOtp();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
            console.error("Partner email send warning:", mailErr.message);
            console.log(`\n========================================\n[DEV] Partner OTP for ${email}: ${otp}\n========================================\n`);
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

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

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
            config.JWT_SECRET || process.env.JWT_SECRET
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
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
            secure: false,
            sameSite: "lax",
            path: "/"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
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

// RESEND OTP
async function resendOtp(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await userModel.findOne({ email });
        const partner = !user ? await foodPartnerModel.findOne({ email }) : null;

        if (!user && !partner) {
            return res.status(404).json({ message: "Account not found with this email" });
        }

        const otp = generateOtp();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await otpModel.deleteMany({ email });

        await otpModel.create({
            email,
            user: user ? user._id : undefined,
            partner: partner ? partner._id : undefined,
            otpHash,
            expiresAt
        });

        const html = getOtpHtml(otp);
        try {
            await sendEmail(email, "Cravio OTP Verification", `Your new OTP is ${otp}`, html);
        } catch (mailErr) {
            console.error("Resend email warning:", mailErr.message);
            console.log(`\n========================================\n[DEV] Resent OTP for ${email}: ${otp}\n========================================\n`);
        }

        return res.status(200).json({ message: "A new OTP has been sent to your email." });
    } catch (err) {
        console.error("Resend OTP error:", err);
        return res.status(500).json({ message: "Failed to resend OTP" });
    }
}

export default {
    registerUser,
    verifyEmail,
    resendOtp,
    loginUser,
    refreshToken,
    logoutUser,
    logoutAllDevices,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};