import bcrypt from "bcryptjs";
import { sendEmail } from "../config/nodemailer.js";
import { resetPasswordTemplate, verifyEmailTemplate } from "./emailTemplate.js";


const VERIFY_EXPIRY_MS = 5 * 60 * 1000;
const RESET_EXPIRY_MS = 5 * 60 * 1000;

export const generateAndSendOtp = async (user, purpose = "verify") => {
    
    // Check for if user already verified
    if (purpose === "verify" && user.isVerified) {
        throw new Error("User is already verified")
    }

    if (purpose === "resetPassword" && !user.isVerified) {
        throw new Error("User must verify their email before resetting password")
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);


    if (purpose === "verify") {
        user.verifyOtp = otpHash;
        user.verifyOtpExpireAt = Date.now() + VERIFY_EXPIRY_MS;
    } else if (purpose === "resetPassword") {
        user.resetOtp = otpHash;
        user.resetOtpExpireAt=Date.now()+RESET_EXPIRY_MS;
    }

    await user.save();

    const { subject, html } = getEmailContent(purpose, user, otp);

    await sendEmail({
        to: user.email,
        subject,
        html
    })
};

const getEmailContent = (purpose, user, otp)=>{
    if (purpose === "verify") {
        return {
            subject: "SecureNation - Verify you email 🔒",
            html:verifyEmailTemplate(user.name,otp)
        }
    }
    if (purpose === "resetPassword") {
        return {
            subject: "SecureNation - Reset your password 🔑",
            html:resetPasswordTemplate(user.name,otp)
        }
    }
    
    throw new Error(`Invalid OTP purpose: ${purpose}`)
}