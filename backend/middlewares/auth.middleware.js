import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
   
    
    const token = req.cookies?.accessToken || req.headers("authorization")?.replace("Bearer", "");

    if (!token) {
        throw new ApiError(401,"Unauthorized access")
    }

    const decodedInfo = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedInfo?._id).select("-password -verifyOtp -verifyOtpExpireAt -isVerified -resetOtp -resetOtpExpireAt");

    if (!user) {
        throw new ApiError(401,"Invalid access token")
    }
    req.user = user;
    next();
})