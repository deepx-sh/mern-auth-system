import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
});

export const sendEmail = async (options)=>{
    try {
        const mailOptions = {
            from: `SecureNation <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text || undefined,
            html:options.html || undefined
        }

        await transporter.sendMail(mailOptions);
        logger.info("Mail sent successfully");
        
    } catch (error) {
        logger.error("Failed to send email",error);
        throw new Error("Email could not be sent")
    }
}