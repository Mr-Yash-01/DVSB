// Import the nodemailer module
const nodemailer = require('nodemailer');

// Load environment variables from a .env file
require('dotenv').config({ path: './.env' });

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    // SMTP server host
    host: process.env.EMAIL_HOST,
    // SMTP server port
    port: process.env.EMAIL_PORT,
    // Use secure connection (true for port 465, false for other ports)
    secure: process.env.EMAIL_PORT === 'true',
    auth: {
        // SMTP server username
        user: process.env.EMAIL_USERNAME,
        // SMTP server password
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Verify the SMTP connection configuration
transporter.verify((error, success) => {
    if (error) {
        // Log error if verification fails
        console.error('SMTP connection error:', error);
    } else {
        // Log success message if verification succeeds
        console.log('SMTP server is ready to take our messages:', success);
    }
});

// Function to send an email
exports.sendEmail = async (to, subject, text) => {
    // Email options
    const mailOptions = {
        // Sender address
        from: process.env.EMAIL_USERNAME,
        // List of receivers
        to,
        // Subject line
        subject,
        // Plain text body
        text,
    };

    try {
        // Send email using the transporter
        await transporter.sendMail(mailOptions);
        // Log success message if email is sent successfully
        console.log('Email sent successfully to:', to);
    } catch (error) {
        // Log error if email sending fails
        console.error('Error sending email:', error);
    }
};
