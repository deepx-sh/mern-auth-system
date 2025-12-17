const escapeHtml = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}
export const welcomeEmailTemplate = (name) => {
   return `<h2> Welcome to <strong>SecureNation</strong>🥳</h2>
    <p>Hi ${escapeHtml(name)},</p>
    <p>Your account has been successfully verified. We're excited to have you onboard!</p>
    <p>Start exploring your dashboard and let us know if you need help.</p>
    <p>Cheers,<br><strong>The SecureNation Team</strong></p>`;
};

export const verifyEmailTemplate = (name, otp) => {
    return `<h2>Verify your <strong>SecureNation</strong> account 🔒</h2>
    <p>Hi ${escapeHtml(name)},</p>
    <p>Your verification code is:</p>
    <h1 style="letter-spacing:4px">${otp}</h1>
    <p>This code expire in <strong>5 minutes</strong></p>
    <p>If you didn't request this, you can safely ignore this email</p>
    <p>Cheers, <strong>The SecureNation Team</strong></p>`;
};

export const resetPasswordTemplate = (name, otp) => {
    return `<h2>Reset your <strong>SecureNation</strong> password 🔑</h2>
    <p>Hi ${escapeHtml(name)},</p>
    <p>Your reset code is:</p>
    <h1 style="letter-spacing:4px">${otp}</h1>
    <p>This code expire in <strong>5 minutes</strong></p>
    <p>If you didn't request this, you can safely ignore this email</p>
    <p>Cheers, <strong>The SecureNation Team</strong></p>`;
}