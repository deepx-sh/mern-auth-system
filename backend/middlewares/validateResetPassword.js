import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()]).{8,32}$/;

export const validateResetPassword = asyncHandler(async (req, res, next) => {
    
    const { resetToken, newPassword } = req.body || {};

    if (!resetToken || !newPassword) {
        throw new ApiError(400,"Reset token and new password are required")
    }

    const trimmedToken = resetToken.trim();
    const trimmedPassword = newPassword.trim();

    if (!trimmedToken || !trimmedPassword) {
        throw new ApiError(400,"Please enter a valid reset token or a valid password")
    }

    if (!passwordRegex.test(trimmedPassword)) {
        throw new ApiError(400,"Password requires at least one digit, one lowercase letter, one uppercase letter, one special character, and a length between 8 and 32 characters.")
    }

    req.body.resetToken = trimmedToken;
    req.body.newPassword = trimmedPassword;

    next();
})
