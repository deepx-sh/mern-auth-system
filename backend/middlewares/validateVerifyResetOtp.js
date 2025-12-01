import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const emailRegex =/^\S+@\S+\.\S+$/;

export const validateVerifyResetOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
        throw new ApiError(400,"Email and reset OTP are required")
    }

    const trimmedEmail = email.trim();
    const trimmedOtp = String(otp).trim();

    if (!trimmedEmail || !trimmedOtp) {
        throw new ApiError(400, "Email and reset OTP are required");
    }

    if (!emailRegex.test(trimmedEmail)) {
        throw new ApiError("Enter a valid email");
    }

    if (!/^\d{6}$/.test(trimmedOtp)) {
        throw new ApiError(400, "Enter a valid reset OTP code");
    }

    req.body.email = trimmedEmail;
    req.body.otp = trimmedOtp;

    next();
})