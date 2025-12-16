import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const emailRegex =/^\S+@\S+\.\S+$/;


export const validateForgotPassword = asyncHandler(async (req, res, next) => {
    
    const { email } = req.body || {};

    if (!email) {
        throw new ApiError(400,"Email is required")
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
        throw new ApiError(400, "Email cannot be empty");
    }

    if (!emailRegex.test(trimmedEmail)) {
        throw new ApiError(400,"Please enter a valid email address")
    }

    req.body.email = trimmedEmail;

    next();
})