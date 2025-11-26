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

app.get("/", (req, res) => {
  return res.send("<h1>Home Page</h1>");
});

// Auth Api Endpoint

import authRouter from "./routes/auth.routes.js";

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
