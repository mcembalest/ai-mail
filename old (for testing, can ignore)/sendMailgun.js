import FormData from "form-data";
import Mailgun from "mailgun.js";
import dotenv from "dotenv";

dotenv.config();

async function sendSimpleMessage() {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
  });
  try {
    const data = await mg.messages.create("sandboxd958497401ba4e18bbb75caa5f38e00f.mailgun.org", {
      from: "Mailgun Sandbox <postmaster@sandboxd958497401ba4e18bbb75caa5f38e00f.mailgun.org>",
      to: ["Max Cembalest <macembalest@gmail.com>"],
      subject: "Hello Max Cembalest",
      text: "Congratulations Max Cembalest, you just sent an email with Mailgun! You are truly awesome!",
    });

    console.log("Email sent successfully!");
    console.log(data);
  } catch (error) {
    console.error("Error sending email:");
    console.error(error);
  }
}

sendSimpleMessage();