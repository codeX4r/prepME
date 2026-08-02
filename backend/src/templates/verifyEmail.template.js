export const verifyEmailTemplate = (url) => {

    return `
        <h2>Welcome to PrepMe</h2>

        <p>Please verify your email.</p>

        <a href="${url}">
            Verify Email
        </a>

        <p>This link expires in 15 minutes.</p>
    `;

};