import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const emailRegex =/^\S+@\S+\.\S+$/;


export const validateForgotPassword = asyncHandler(async (req, res, next) => {
    
    const { email } = req.body || {};

    if (!email) {
        throw new ApiError(400,"Email is required")
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        throw new ApiError(400, "Email is required");
    }

    if (!emailRegex.test(trimmedEmail)) {
        throw new ApiError(400,"Enter a valid email")
    }

    req.body.email = trimmedEmail;

    next();
})