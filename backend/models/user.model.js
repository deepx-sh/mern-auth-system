import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SessionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto:true
  },
  refreshTokenHash: {
    type: String,
    required:true
  },
  userAgent: {
    type: String,
  },
  ip: {
    type:String
  },
  createdAt: {
    type: Date,
    default:Date.now
  },
  lastUsedAt: {
    type: Date,
    default:Date.now
  },
  expiresAt: {
    type:Date
  }
})
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,"Name is required"],
      trim: true,
      minLength:[2,"Name must be at least 2 characters"]
    },
    email: {
      type: String,
      required: [true,"Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true,"Password is required"],
      minLength: [8,"Password must be at least 8 characters"],
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    sessions: {
      type: [SessionSchema],
      default:[]
   }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password match or not
userSchema.methods.isPasswordMatch = async function (typedPassword) {
  return await bcrypt.compare(typedPassword, this.password);
};

// Clean expire sessions
userSchema.methods.cleanupExpiredSessions = function () {
  this.sessions = this.sessions.filter(s => s.expiresAt > Date.now());
}

userSchema.pre('save', function (next) {
  this.cleanupExpiredSessions();
  next();
})
// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE || "15m",
    }
  );
};


// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id:this._id
    },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.JWT_REFRESH_TOKEN_EXPIRE || "7d"
    }
  )
}
export const User = mongoose.model.User || mongoose.model("User", userSchema);

// export default User
