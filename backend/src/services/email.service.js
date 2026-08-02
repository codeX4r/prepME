import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

import { verifyEmailTemplate } from "../templates/verifyEmail.template.js"

export const sendEmail = async ({ to, subject, url }) => {

    console.log("Sending verification email...");

    return await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            name: process.env.MAIL_FROM_NAME,
            email: process.env.MAIL_FROM,
        },

        to: [
            {
                email: to,
            },
        ],

        subject,

        htmlContent: verifyEmailTemplate(url),
    });
};