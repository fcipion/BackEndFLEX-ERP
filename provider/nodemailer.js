require("dotenv/config")
const nodemailer = require('nodemailer');

const email = process.env.NODEMAILER_EMAIL
const password = process.env.NODEMAILER_PASSWORD

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: password
    }
});

async function sendMessage(to, subject, html) {
    const mailOptions = {
        from: email,
        to,
        subject,
        html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo:', error);
        } else {
            console.log('Correo enviado correctamente:', info.response);
        }
    });
}

module.exports.sendMessage = sendMessage