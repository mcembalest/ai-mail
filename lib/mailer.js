import nodemailer from "nodemailer";
import dotenv from "dotenv";

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

export async function sendReply({ to, subject, text, inReplyTo, references }) {
  const finalSubject = subject?.trim().toLowerCase().startsWith("re:")
    ? subject
    : `Re: ${subject || ""}`.trim();

  const headers = {};
  if (inReplyTo) headers["In-Reply-To"] = inReplyTo;
  if (references) headers["References"] = references;

  const info = await transporter.sendMail({
    from: `Email with AI Models <${process.env.SMTP_USER}>`,
    to,
    subject: finalSubject,
    text: text || "",
    headers,
  });

  return info;
}
