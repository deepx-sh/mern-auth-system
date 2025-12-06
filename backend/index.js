import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Database Connection
connectDB();

app.set('trust proxy',1)
app.use(express.json());
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
app.use(apiSpeedLimiter)
app.get("/", (req, res) => {
  return res.send("<h1>Home Page</h1>");
});

// Auth Api Endpoint

import authRouter from "./routes/auth.routes.js";
import { ApiError } from "./utils/ApiError.js";
import { apiSpeedLimiter, globalLimiter } from "./middlewares/rateLimiter.middleware.js";

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors:err.errors || []
    })
  }

  return res.status(500).json({
    success: false,
    message:err.message || "Internal Server Error"
  })
})
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
