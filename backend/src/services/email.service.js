import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({ apiKey: 'your-api-key' });

const result = await brevo.transactionalEmails.sendTransacEmail({
    subject: 'Hello from Brevo!',
    htmlContent: '<html><body><p>Hello,</p><p>This is my first transactional email.</p></body></html>',
    sender: { name: 'Alex from Brevo', email: 'hello@brevo.com' },
    to: [{ email: 'johndoe@example.com', name: 'John Doe' }],
});

console.log('Email sent. Message ID:', result.messageId);
