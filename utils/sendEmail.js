const nodemailer = require("nodemailer");

const sendEmail = async function(userEmail) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: "Amazon Clone <foo@email.com>",
        to: userEmail.email,
        subject: userEmail.subject,
        text: userEmail.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;