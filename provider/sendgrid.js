require("dotenv/config")
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENGRID_API_KEY);

async function sendMessage(to, subject, html) {
  const mensaje = {
    to,
    from: process.env.SENGRID_EMAIL,
    subject,
    html
  };

  try {
    await sgMail.send(mensaje);
  } catch (error) {
    console.error('Error send message:', error);
  }
}

module.exports.sendMessage = sendMessage