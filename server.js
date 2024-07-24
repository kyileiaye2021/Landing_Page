//Import required modules
require('dotenv').config(); //loads environment var from a .env file to process.env
const express = require('express'); //web framework for Node.js
const nodemailer = require('nodemailer'); //for sending emails
const path = require('path'); // for handling and transforming files
const bodyParser = require('body-parser');// to parse incoming request bodies
const exp = require('constants');

//Initialize Express app
const app = express(); //creates an express app
const port = process.env.PORT || 3000;

//Middleware to Parse Form data
app.use(bodyParser.urlencoded({ extended: true})); //parse form data

//Serve static files (html, css, and javascript)
app.use('/assets',express.static(path.join(__dirname, 'assets')));

app.use('/images',express.static(path.join(__dirname, 'images')))
//Serve static html file
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

//Setting email configuration using environment var
const emailConfig = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
};

console.log('Email user:', emailConfig.user);
console.log('Email pass:', emailConfig.pass);

//Create transporter obj using nodemailer to send emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: emailConfig.user,
        pass: emailConfig.pass,
    },
});

//Send email using transporter
const sentAutoReply = async (sender_name, to) => {
    try {
        let info = await transporter.sendMail({
            from: `"Kyi Lei Aye" <${emailConfig.user}>`,
            to: to,
            subject: 'Auto-Reply: Thanks for reaching out to me!',
            text: `Hi ${sender_name}, This is Kyi!. Thank you for your message. I will get back to you as soon as possible!`
        });
        console.log('Auto-reply sent: %s', info.messageId);
    }
    catch (error) {
        console.error('Error sending auto-reply: ', error);
        
    }
};

//handling route to request page
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    console.log(`New message form ${name} (${email}): ${message}`);
    await sentAutoReply(name, email);
    res.send('Thank you for your message!');
});

//Run the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});