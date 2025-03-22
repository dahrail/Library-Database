require("dotenv").config();

const nodemailer = require("nodemailer");

function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use the environment variable here
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

const args = process.argv.slice(2);
const to = args[0];
const subject = args[1];
const text = args[2];

sendEmail(to, subject, text);