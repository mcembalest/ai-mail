import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });


(async () => {
    try {

        const info = await transporter.sendMail({
            from: '"Email with AI Models" <emailwithaimodels@gmail.com>', 
            to: "macembalest@gmail.com",
            subject: "This should work better!",
            text: "Success!",
            // html: `
            //     <div style="text-align: center;">
            //         <img src="cid:hobie" alt="Hobie" style="max-width: 500px; border-radius: 8px;">
            //         <p style="font-family: sans-serif; color: #444;">Here's a picture of Hobie</p>
            //     </div>
            // `,
            // attachments: [
            //     {
            //         filename: 'public/assets/hobie.jpeg',
            //         path: './public/assets/hobie.jpeg',
            //         cid: 'hobie'
            //     }
            // ]
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error while sending mail", err);
    }
})();