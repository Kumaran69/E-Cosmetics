const nodemailer = require('nodemailer');

// Sends an email using SMTP credentials from .env.
// If SMTP is not configured, logs the email to the console instead of failing,
// so auth flows (password reset, notifications) keep working in development.
const sendEmail = async ({ to, subject, html, text }) => {
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!hasSmtpConfig) {
    console.log('--- Email (SMTP not configured, logging instead) ---');
    console.log(`To: ${to}\nSubject: ${subject}\n${text || html}`);
    console.log('-----------------------------------------------------');
    return { logged: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Glow Cosmetics" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
};

module.exports = sendEmail;
