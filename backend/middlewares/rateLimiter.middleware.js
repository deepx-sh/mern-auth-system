import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import slowDown from 'express-slow-down';

const keyGenerator = (req) => {
    return req.user?._id?.toString() || ipKeyGenerator(req.ip);
};

// For Login
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message:"Too many login attempts. Please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    skipSuccessfulRequests: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many login attempts. Please try again after 15 minutes",
            retryAfter:Math.ceil((req.rateLimit.resetTime-Date.now())/1000)
        })
    }
});

// For Register
export const registerLimiter=rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message:"Too many accounts created. Please try again after 1 hour"
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator:(req)=>ipKeyGenerator(req.ip),
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many accounts created. Please try again after 1 hour",
            retryAfter:Math.ceil((req.rateLimit.resetTime-Date.now())/1000)
        })
    }
});

// For OTP Request
export const otpLimiter=rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message:"Too many OTP requests. Please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many OTP requests. Please try again later",
            retryAfter:Math.ceil((req.rateLimit.resetTime-Date.now())/1000)
        })
    }
});


// For Password Reset
export const passwordResetLimiter=rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message:"Too many password reset attempts. Please try again after 1 hour"
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many password reset attempts. Please try again after 1 hour",
            retryAfter:Math.ceil((req.rateLimit.resetTime-Date.now())/1000)
        })
    }
});


// For OTP verification
export const otpVerifyLimiter=rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message:"Too many failed OTP attempts. Please request a new OTP after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many failed OTP attempts. Please request a new OTP after 15 minutes",
            retryAfter:Math.ceil((req.rateLimit.resetTime-Date.now())/1000)
        })
    }
});


// Speed Limiters for API
export const apiSpeedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: (hits) => hits * 1000,
    maxDelayMs: 5000,
    keyGenerator
});


// Global Rate Limiter protect from DDoS

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        success: false,
        message:"Too many requests from this IP. Please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => { 
        res.status(429).json({
            success: false,
            message: "Too many requests. Please try again after 15 minutes",
            retryAfter:Math.ceil((req.rateLimit.resetTime-Date.now())/1000)
        })
    }
})