import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUserData = asyncHandler(async (req, res) => {
    
    const { email } = req.user;

    if (!email) {
        throw new ApiError(400, "Authenticated user email is missing");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    
    return res.status(200).json(new ApiResponse(200,{name:user.name,isVerified:user.isVerified},"User data fetched successfully"))
})