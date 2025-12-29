const requireEnvVars = [
  "MONGODB_URI",
  "JWT_ACCESS_TOKEN_SECRET",
  "JWT_ACCESS_TOKEN_EXPIRE",
  "JWT_REFRESH_TOKEN_SECRET",
  "JWT_REFRESH_TOKEN_EXPIRE",
  "JWT_RESET_PASSWORD_SECRET",
  "JWT_RESET_PASSWORD_EXPIRE",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
];

requireEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    logger.error(`ENVIRONMENT VARIABLE MISSING ${varName}`);
    process.exit(1);
  }
});
import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import helmet from "helmet"
import logger, { morganStream } from "./utils/logger.js";
const app = express();
const PORT = process.env.PORT || 4000;

// Database Connection
connectDB();
app.use(helmet())
app.use(morgan("combined", { stream: morganStream }));
app.set("trust proxy", 1);
app.use(express.json());
app.use(mongoSanitize())
app.use(cookieParser());

const allowedOrigin = [
  process.env.CLIENT_URL_LOCAL,
  process.env.CLIENT_URL_PROD,
].filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigin.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(globalLimiter);
app.use(apiSpeedLimiter);
app.get("/", (req, res) => {
  return res.send("<h1>Home Page</h1>");
});

// Auth Api Endpoint

import authRouter from "./routes/auth.routes.js";
import { ApiError } from "./utils/ApiError.js";
import {
  apiSpeedLimiter,
  globalLimiter,
} from "./middlewares/rateLimiter.middleware.js";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { startSessionCleanup } from "./utils/sessionCleanup.js";

app.get("/health", (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})
app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  logger.error(`SERVER ERROR ${err.message}`, err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

startSessionCleanup();
