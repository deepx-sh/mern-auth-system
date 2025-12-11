
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendWelcomeEmail } from "./email.controller.js";
import { generateAndSendOtp } from "../utils/generateSendOtp.js";
import jwt, { decode } from 'jsonwebtoken'
import { createSessionAndToken } from "../utils/auth.js";
import { hashToken, safeCompare } from "../utils/tokenHash.js";


const generateAccessTokensAndRefreshTokens = async (userId) => {
    
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // user.refreshToken = refreshToken;

        user.refreshToken.push({ token: refreshToken })
        
        if (user.refreshToken.length > 5) {
            user.refreshToken.shift();
        }
        await user.save({validateBeforeSave:false})
        return { accessToken ,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access token")
    }
}


// Helper function for cookie options
const getCookieOptions = (maxAge) => ({
     httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge,
})
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

    const createdUser=await User.findById(user._id).select("-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt -refreshToken")


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
    await generateAndSendOtp(createdUser, "verify")
    
    const newCreatedUser = await User.findById(user._id).select("-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt -refreshToken");
    // return res.status(201).cookie("accessToken", token, options).json(new ApiResponse(200, createdUser, "User registration successfully!"));
    return res.status(201).json(new ApiResponse(200,newCreatedUser,"User registered successfully. OTP sent to you email"))

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
    // const {accessToken,refreshToken} = await generateAccessTokensAndRefreshTokens(user._id);

    const {accessToken,refreshToken,sessionId}=await createSessionAndToken(user,req)

    const loggedInUser = await User.findById(user._id).select("-password -verifyOtp -verifyOtpExpireAt  -resetOtp -resetOtpExpireAt -refreshToken");
    loggedInUser.sessionId=sessionId

    // Cookie Config
    // const options = {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    //     maxAge:7*24*60*60*1000,
    // }
    return res.status(200).cookie("accessToken", accessToken, getCookieOptions(15*60*1000)).cookie("refreshToken",refreshToken,getCookieOptions(7*24*60*60*1000)).json(new ApiResponse(200, loggedInUser, "User logged in successfully!"));

});


export const logout = asyncHandler(async (req, res) => {
    // Cookie Config
    // const options = {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    //     maxAge:7*24*60*60*1000,
    // }
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    // const userId = req.user?.id;
    if (incomingRefreshToken) {
        try {
            const decodedInfo = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
            const user = await User.findById(decodedInfo._id);

            if (user) {
                user.sessions = user.sessions.filter(s => s._id.toString() !== decodedInfo.sid);
                await user.save();
            }
        } catch (error) {
            
        }
   }

    const options=getCookieOptions(0)
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logout successfully"))
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

    // const {accessToken,refreshToken} = await generateAccessTokensAndRefreshTokens(user._id)
        const {accessToken,refreshToken,sessionId}=await createSessionAndToken(user,req)

    
    const loggedInUser = await User.findById(user._id).select("-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt -refreshToken")
    loggedInUser.sessionId=sessionId
    // Cookie Config
    // const options = {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    //     maxAge:7*24*60*60*1000,
    // }

    return res.status(200).cookie("accessToken",accessToken,getCookieOptions(15*60*1000)).cookie("refreshToken",refreshToken,getCookieOptions(7*24*60*60*1000)).json(new ApiResponse(200,loggedInUser,"Email Verified Successfully. Logged in"))
});

// Resend Verify OTP for email verification

export const resendVerifyOtp = asyncHandler(async (req, res) => {
    const { email } = req.body || {}
    
    if (!email || email.trim() === "") {
        throw new ApiError(400,"Email is required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    if (user.isVerified) {
        throw new ApiError(400,"Email is already verified")
    }

    await generateAndSendOtp(user, "verify");

return res.status(200).json(new ApiResponse(200,{},"Verification OTP sent"))
})
// Check if user is authenticated or not

export const isAuthenticated = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401,"User is not authenticated")
    } 
     return res.status(200).json(new ApiResponse(200,{},"User is authenticated"))
});


// Send Password Reset OTP
export const sendPasswordResetOtp = asyncHandler(async (req, res) => {
    const { email } = req.body || {}
    
    if (!email) {
        throw new ApiError(400,"Email is required")
    }

    // Find User by Email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(200).json(new ApiResponse(200,{},"If this email is registered, an OTP has been sent"))
    }

    // Only allow if user email is already verified
    if (!user.isVerified) {
        throw new ApiError(400,"Please verify your email before resetting password")
    }

    const existUser=await User.findById(user._id).select("-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt -refreshToken")
    // Generate reset otp and send to registered email
    await generateAndSendOtp(existUser, "resetPassword");

    return res.status(200).json(new ApiResponse(200,{},"Password reset OTP sent to your registered email"))
});


// Verify Reset OTP

export const verifyResetPasswordOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
        throw new ApiError(400,"Email and OTP are required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    if (!user.resetOtp || !user.resetOtpExpireAt) {
        throw new ApiError(400,"No reset OTP found. Please request new one")
    }

    // Check for expiry
    if (Date.now() > user.resetOtpExpireAt) {
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();

        throw new ApiError(400,"OTP has expired. Please request new one")
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, user.resetOtp);

    if (!isMatch) {
        throw new ApiError(400,"Invalid OTP")
    }

    // OTP Correct
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    // Short Lived reset token
    const resetToken = jwt.sign({
        _id: user._id,
        email: user.email,
        purpose:"resetPassword"
    }, process.env.JWT_RESET_PASSWORD_SECRET,
        { expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRE });
    
    return res.status(200).json(new ApiResponse(200,{resetToken},"OTP verified successfully. You can now reset your password"))
});


export const resetPassword = asyncHandler(async (req, res) => {
    const { resetToken, newPassword } = req.body || {};
    
    if (!resetToken || !newPassword) {
        throw new ApiError(400,"Reset token and new password are required")
    }

    let decodedInfo;
    try {
        decodedInfo=await jwt.verify(resetToken,process.env.JWT_RESET_PASSWORD_SECRET)
    } catch (error) {
        throw new ApiError(400,"Invalid or expire reset token")
    }
     
    const user = await User.findById(decodedInfo._id);

    if (!user) {
        throw new ApiError(404,"User not found")
    }

    if (decodedInfo.purpose !== "resetPassword") {
        throw new ApiError(400,"Invalid reset token purpose")
    }

    // Hash Password and save
    user.password = newPassword;
    user.sessions = [];
    await user.save();

    return res.status(200).json(new ApiResponse(200,{},"Password reset successfully"))
});


// RefreshToken

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
   
    console.log(incomingRefreshToken);
    
    if (!incomingRefreshToken) {
        throw new ApiError(401,"Refresh token is required")
    }

    let decodedInfo;
    try {
        decodedInfo=jwt.verify(incomingRefreshToken,process.env.JWT_REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401,"Invalid or expired refresh token")
    }

    const userId = decodedInfo._id;
    const sid = decodedInfo.sid;
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(401,"User not found")
    }

    const session = user.sessions.id(sid);
    if (!session) {
        // user.sessions = [];
        // await user.save();
        throw new ApiError(401,"Session not found")
    }

    const incomingHash = hashToken(incomingRefreshToken);

    if (!safeCompare(incomingHash, session.refreshTokenHash)) {
        user.sessions = [];
        await user.save();
        throw new ApiError(401,"Refresh token mismatch - possible theft")
    }

    const newRefreshToken = jwt.sign({ _id: user._id.toString(), sid: session._id.toString() }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE });
    const newRefreshHash = hashToken(newRefreshToken);

    session.refreshTokenHash = newRefreshHash;
    session.lastUsedAt = new Date();
    session.expiresAt=new Date(Date.now()+(7*24*3600*1000))
    await user.save();

    const newAccessToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE })
    
    return res.status(200).cookie("accessToken",newAccessToken,getCookieOptions(15*60*1000)).cookie("refreshToken",newRefreshToken,getCookieOptions(7*24*60*60*1000)).json(new ApiResponse(200,{accessToken:newAccessToken},"Token refreshed"))
});


export const listSessions = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("sessions");
    if (!user) {
        throw new ApiError(404,"User not found")
    }

    const sessions = user.sessions.map(s => ({
        id: s._id,
        userAgent: s.userAgent,
        ip: s.ip,
        createdAt: s.createdAt,
        lastUsedAt: s.lastUsedAt,
        expiresAt: s.expiresAt,
        isCurrent: req.cookies?.refreshToken ? (() => {
            try {
                const decodedInfo = jwt.verify(req.cookies.refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
                return decodedInfo?.sid === s._id.toString();
            } catch (error) {
                return false;
            }
        })() : false
    }))

    return res.status(200).json(new ApiResponse(200,sessions,"Sessions fetched successfully"))
});


export const revokeSession = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404,"User not found")
    }

    const sessionId = req.params.id;
    user.sessions = user.sessions.filter(s => s._id.toString() !== sessionId);
    await user.save();

    return res.status(200).json(new ApiResponse(200,{},"Session revoked successfully"))
});

export const logoutAll = asyncHandler(async(req,res)=> {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404,"User not found")
    }
    user.sessions = [];
    await user.save();
    return res.status(200).clearCookie("accessToken",getCookieOptions(0)).clearCookie("refreshToken",getCookieOptions(0)).json(new ApiResponse(200,{},"All sessions revoked successfully"))
})