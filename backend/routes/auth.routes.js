import { Router } from "express";
import { isAuthenticated, login, logout, register, resendVerifyOtp, resetPassword, sendPasswordResetOtp, verifyEmailOtp, verifyResetPasswordOtp } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateEmailDomain } from "../middlewares/emailDomain.middleware.js";

const router = Router();

router.route("/register").post(validateEmailDomain,register);

router.route("/login").post(login);

router.route("/logout").post(verifyJWT, logout);

router.route("/verify-otp").post(verifyEmailOtp)

router.route("/resend-verify-otp").post(resendVerifyOtp)

router.route("/is-auth").post(verifyJWT, isAuthenticated)


router.route("/forget-password").post(validateEmailDomain,sendPasswordResetOtp)

router.route("/verify-reset-otp").post(verifyResetPasswordOtp)

router.route("/reset-password").post(resetPassword)
export default router