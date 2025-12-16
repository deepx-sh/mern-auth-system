import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const emailRegex =/^\S+@\S+\.\S+$/;

export const validateVerifyEmailOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
        throw new ApiError(400,"Email and OTP are required")
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = String(otp).trim();

    if (!trimmedEmail || !trimmedOtp) {
        throw new ApiError(400, "Email and OTP cannot be empty");
    }

    if (!emailRegex.test(trimmedEmail)) {
        throw new ApiError(400,"Please enter a valid email address");
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
        throw new ApiError(400, "OTP must be exactly 6 digit");
    }

    req.body.email = trimmedEmail;
    req.body.otp = trimmedOtp;

    next();
})