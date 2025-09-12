import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });


(async () => {
    try {
        const info = await transporter.sendMail({
            from: '"Max" <macembalest@gmail.com>', // sender address
            to: "mmh176@gmail.com", // list of receivers
            subject: "Hello?", // Subject line
            text: "Hello?", // plain text body
            html: "<b>Hello there?</b>", // html body
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail", err);
    }
})();