import axios from 'axios';


const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmail = async ({ to, subject, html }) => {
    try {
        const data = {
            sender: { 
                name: "SecureNation", 
                email: process.env.BREVO_FROM_EMAIL 
            },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html
        };

        await axios.post(BREVO_API_URL, data, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log(`Successfully email sent to ${to}`);
    } catch (error) {
        console.error("Failed to send email via API");
     
        console.error(error.response?.data || error.message);
        throw new Error("Email could not be sent");
    }
};

export default sendEmail;