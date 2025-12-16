import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const emailRegex = /^\S+@\S+\.\S+$/;

export const validateLogin = asyncHandler(async (req, res,next) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password;

    if (!trimmedEmail || !trimmedPassword) {
        throw new ApiError(400,"Email and password cannot be empty");
        
    }

    if (!emailRegex.test(trimmedEmail)) {
        throw new ApiError(400,"Please enter a valid email address")
    }

    req.body.email = trimmedEmail;
    req.body.password = trimmedPassword;

    next();
})