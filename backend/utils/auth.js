import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import { hashToken } from "./tokenHash.js";

export const createSessionAndToken = async (user, req) => {
    const sessionId = new mongoose.Types.ObjectId();

    const refreshToken = jwt.sign({
        _id: user._id.toString(),
        sid:sessionId.toString()
    },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.JWT_REFRESH_TOKEN_EXPIRE
        }
    );

    const refreshTokenHash = hashToken(refreshToken);

    const session = {
        _id: sessionId,
        refreshTokenHash,
        userAgent: req.get("User-Agent") || "Unknown",
        ip: req.ip || req.headers["x-forwarded-for"] || null,
        createdAt: new Date(),
        lastUsedAt: new Date(),
        expiresAt:new Date(Date.now()+(7*24*3600*1000))
    }

    if (user.sessions.length >= 5) {
        user.sessions.sort((a, b) => new Date(a.lastUsedAt) - new Date(b.lastUsedAt))
        user.sessions.shift();
    }
    user.sessions.push(session);
    await user.save();

    const accessToken = jwt.sign({
        _id: user._id.toString(),
        sid: sessionId.toString()
    },
        process.env.JWT_ACCESS_TOKEN_SECRET,

        {
            expiresIn:process.env.JWT_ACCESS_TOKEN_EXPIRE
        }
    );

    return {accessToken,refreshToken,sessionId:sessionId.toString()}
}