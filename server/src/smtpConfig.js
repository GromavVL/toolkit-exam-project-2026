require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports.sendMessage = async (receiver, subjects, texts) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: receiver,
      subject: subjects,
      text: texts,
    });

    return info;
  } catch (err) {
    console.error('Error while sending mail:', err);
  }
};
