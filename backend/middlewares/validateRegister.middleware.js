
const emailRegex =/^\S+@\S+\.\S+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,32}$/;

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const validateRegister = asyncHandler(async (req, res,next) => {
    
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password;

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        throw new ApiError(400, "All fields are required");
    }

    if (!emailRegex.test(trimmedEmail)) {
        throw new ApiError(400, "Enter a valid email address");
    }

    if (!passwordRegex.test(trimmedPassword)) {
        throw new ApiError(400,"Password requires at least one digit, one lowercase letter, one uppercase letter, one special character, and a length between 8 and 32 characters.")
    }

    req.body.name = trimmedName;
    req.body.email = trimmedEmail;
    req.body.password = trimmedPassword;

    next();
})