import { Router } from "express";
import { isAuthenticated, login, logout, refreshAccessToken, register, resendVerifyOtp, resetPassword, sendPasswordResetOtp, verifyEmailOtp, verifyResetPasswordOtp } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateEmailDomain } from "../middlewares/emailDomain.middleware.js";
import { validateRegister } from "../middlewares/validateRegister.middleware.js";
import { validateLogin } from "../middlewares/validateLogin.middleware.js";
import { validateVerifyEmailOtp } from "../middlewares/validateVerifyEmailOtp.js";
import { validateForgotPassword } from "../middlewares/validateForgotPassword.js";
import { validateVerifyResetOtp } from "../middlewares/validateVerifyResetOtp.js";
import { validateResetPassword } from "../middlewares/validateResetPassword.js";
import { loginLimiter, otpLimiter, otpVerifyLimiter, passwordResetLimiter, registerLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.route("/register").post(registerLimiter,validateRegister,validateEmailDomain,register);

router.route("/login").post(loginLimiter,validateLogin,login);

router.route("/logout").post(verifyJWT, logout);

router.route("/verify-otp").post(otpVerifyLimiter,validateVerifyEmailOtp,verifyEmailOtp)

router.route("/resend-verify-otp").post(otpLimiter,resendVerifyOtp)

router.route("/is-auth").post(verifyJWT, isAuthenticated)


router.route("/forget-password").post(passwordResetLimiter,validateForgotPassword,validateEmailDomain,sendPasswordResetOtp)

router.route("/verify-reset-otp").post(otpVerifyLimiter,validateVerifyResetOtp,verifyResetPasswordOtp)

router.route("/reset-password").post(passwordResetLimiter,validateResetPassword, resetPassword)

router.route("/refresh-token").post(refreshAccessToken)
export default router