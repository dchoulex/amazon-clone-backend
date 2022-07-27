const nodemailer = require("nodemailer");

const sendEmail = async function(userEmail) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
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