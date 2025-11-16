import { Router } from "express";
import { login, logout, register, verifyEmailOtp } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(verifyJWT, logout);

router.route("/verify-otp").post(verifyEmailOtp)

export default router