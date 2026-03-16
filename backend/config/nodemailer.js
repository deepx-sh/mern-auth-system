import * as Brevo from '@getbrevo/brevo';

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async ({ to, subject, html }) => {
    try {
        const sendSmtpEmail = {
            sender: { 
                email: process.env.BREVO_FROM_EMAIL, 
                name: 'SecureNation' 
            },
            to: [{ email: to }],
            subject,
            htmlContent: html
        };

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Successfully email sent to ${to}`);
    } catch (error) {
        console.error("Failed to send email", error.message);
        throw new Error("Email could not be sent");
    }
};

export default sendEmail;