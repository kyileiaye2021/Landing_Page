require('dotenv').config(); // Loads environment variables from .env file
const express = require('express'); // Web framework for Node.js
const nodemailer = require('nodemailer'); // For sending emails
const path = require('path'); // For handling and transforming file paths
const bodyParser = require('body-parser'); // To parse incoming request bodies

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve ALL static files in this directory (html, css, js, pdf, etc.)
app.use(express.static(__dirname));

// Serve static files (html, css, and javascript)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Setting email configuration using environment variables
const emailConfig = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
};

console.log('Email user:', emailConfig.user);
console.log('Email pass:', emailConfig.pass);

// Create transporter object using nodemailer to send emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
    },
});

// Function to send auto-reply email
const sendAutoReply = async (senderName, to) => {
    try {
        let info = await transporter.sendMail({
            from: `"Kyi Lei Aye" <${emailConfig.user}>`,
            to: to,
            subject: 'Auto-Reply: Thanks for reaching out to me!',
            text: `Hi ${senderName}, This is Kyi! Thank you for your message. I will get back to you as soon as possible!`
        });
        console.log('Auto-reply sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending auto-reply:', error);
    }
};

// Handling route to request page
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    console.log(`New message from ${name} (${email}): ${message}`);
    await sendAutoReply(name, email);
    res.send('Thank you for your message!');
});

// Run the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
