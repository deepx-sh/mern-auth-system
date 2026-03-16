import nodemailer from 'nodemailer';
import logger from '../utils/logger';

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: process.env.BREVO_SMTP_PORT,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    }
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `SecureNation <${process.env.BREVO_FROM_EMAIL}>`,
            to,
            subject,
            html
        };

        await transporter.sendMail(mailOptions);
        console.log(`Successfully email sent to ${to}`);
    } catch (error) {
        logger.error("Failed to send email");
        logger.error(error.message);
        throw new Error("Email could not be sent");
    }
};

export default sendEmail;