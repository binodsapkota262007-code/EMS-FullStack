import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,   // your Gmail address
    pass: process.env.SMTP_PASS,   // the 16-character App Password (no spaces)
  },
});

const sendEmail = async ({ to, subject, body }) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: body,
  });
  return response;
};

export default sendEmail;