import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserData } from "../controllers/user.controller.js";
const router = Router();

router.get("/user-dashboard", verifyJWT, getUserData);

export default router;