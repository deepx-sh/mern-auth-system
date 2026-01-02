import { sendEmail } from "../config/nodemailer.js";
import { welcomeEmailTemplate } from "../utils/emailTemplate.js";

export const sendWelcomeEmail = async (user)=>{
    try {
        await sendEmail({
            to: user.email,
            subject: "Welcome to SecureNation",
            html:welcomeEmailTemplate(user.name),
        })
    } catch (error) {
        logger.error("Error sending welcome email",error);
        
    }
}

