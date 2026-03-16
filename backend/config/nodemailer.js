const sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await fetch('https://api.brevo.com', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY, // Use your Brevo v3 API Key
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: { 
                    name: "SecureNation", 
                    email: process.env.BREVO_FROM_EMAIL 
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Brevo API Error");
        }

        console.log(`Successfully email sent to ${to}`);
    } catch (error) {
        console.error("Failed to send email");
        console.error(error.message);
        throw new Error("Email could not be sent");
    }
};

export default sendEmail;