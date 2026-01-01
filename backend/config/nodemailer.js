import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: true,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass:process.env.SMTP_PASS
//     }
// });

export const sendEmail = async (options)=>{
    try {
        const mailOptions = {
            // from: `SecureNation <${process.env.SMTP_USER}>`,
            from:`SecureNation <${process.env.SENDGRID_FROM_EMAIL}>`,
            to: options.to,
            subject: options.subject,
            text: options.text || undefined,
            html:options.html || undefined
        }

        // await transporter.sendMail(mailOptions);
        await sgMail.send(mailOptions)
        logger.info("Mail sent successfully");
        
    } catch (error) {
        logger.error("Failed to send email",error);
        throw new Error("Email could not be sent")
    }
}