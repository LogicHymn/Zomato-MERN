import crypto from "crypto";

// Generate 6 digit OTP
export function generateOtp() {
    return crypto.randomInt(100000, 1000000).toString();
}

// Generate OTP expiry (10 minutes)
export function getOtpExpiry() {
    return new Date(Date.now() + 10 * 60 * 1000);
}

// OTP HTML
export function getOtpHtml(otp) {
    return `
        <h2>Email Verification</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP will expire in 10 minutes.</p>

        <p>If you did not request this, ignore this email.</p>
    `;
}