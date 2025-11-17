
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendWelcomeEmail } from "./email.controller.js";
import { generateAndSendOtp } from "../utils/generateSendOtp.js";

const generateAccessTokens = async (userId) => {
    
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        return accessToken;
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access token")
    }
}

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body || {};

    // Check if all field enter by User or not
    if (![name, email, password].every((field => field !== undefined || null))) {
        throw new ApiError(400,"All fields are required")
    }

    // Check if any field blank or not
    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400,"All field are required")
    }

    // Check if user exist or not by email
    const userExist = await User.findOne({ email });

    if (userExist) {
        throw new ApiError(409,"User already exists")
    }

    // Create user and save into DB
    const user = await User.create({
        name,
        email,
        password
    })

    const createdUser=await User.findById(user._id).select("-password -verifyOtp -verifyOtpExpireAt -isVerified -resetOtp -resetOtpExpireAt")


    if (!createdUser) {
        throw new ApiError(500,"User registration failed")
    }
    // Access Token Generation
    // const token = await generateAccessTokens(user._id);

    // Cookie Config
    // const options = {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    //     maxAge:7*24*60*60*1000,
    // }

    // Send Welcome Email

    // await sendWelcomeEmail(createdUser);

    // Send Verification OTP
    await generateAndSendOtp(createdUser,"verify")
    // return res.status(201).cookie("accessToken", token, options).json(new ApiResponse(200, createdUser, "User registration successfully!"));
    return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully. OTP sent to you email"))

})


export const login = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body;

    // Check email and password enter by user or not
    if (!email || !password) {
        throw new ApiError(400,"Email and Password required")
    }

    // Find User
    const user = await User.findOne({email})
    
    if (!user) {
        throw new ApiError(404,"User not found")
    }

    // Check password match or not
    const isPasswordValid = await user.isPasswordMatch(password);

    if (!isPasswordValid) {
        throw new ApiError(401,"Invalid email or password")
    }

     // Access Token Generation
    const token = await generateAccessTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -verifyOtp -verifyOtpExpireAt -isVerified -resetOtp -resetOtpExpireAt");

    // Cookie Config
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge:7*24*60*60*1000,
    }
    return res.status(201).cookie("accessToken", token, options).json(new ApiResponse(200, loggedInUser, "User logged in successfully!"));

});


export const logout = asyncHandler(async (req, res) => {
    // Cookie Config
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge:7*24*60*60*1000,
    }

    return res.status(200).clearCookie("accessToken",options).json(new ApiResponse(200,{},"User logout successfully"))
});


// Verify Email Otp
export const verifyEmailOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
        throw new ApiError(400,"Email and Otp required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    // Already Verified
    if (user.isVerified) {
        throw new ApiError(400,"Email already verified")
    }

    // No otp saved
    if (!user.verifyOtp || !user.verifyOtpExpireAt) {
        throw new ApiError(400,"No OTP found. Please request new one")
    }

    // Check expire
    if (Date.now() > user.verifyOtpExpireAt) {
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();

        throw new ApiError(400,"OTP has expired. Please request a new one")
    }

    // Is OTP Matched
    const isMatch = await bcrypt.compare(otp, user.verifyOtp);

    if (!isMatch) {
        throw new ApiError(400,"Invalid OTP")
    }

    // OTP valid
    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();


    try {
        await sendWelcomeEmail(user)
    } catch (err) {
        console.log("Failed to send welcome email:",err.message);
        
    }

    const token = await generateAccessTokens(user._id)
    
    const loggedInUser=await User.findById(user._id).select("-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt")
    // Cookie Config
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge:7*24*60*60*1000,
    }

    return res.status(200).cookie("accessToken",token,options).json(new ApiResponse(200,loggedInUser,"Email Verified Successfully. Logged in"))
})