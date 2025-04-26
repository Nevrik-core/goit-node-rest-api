import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { UKR_NET_USER, UKR_NET_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_USER,
    pass: UKR_NET_PASS,
  },
});

export const sendVerificationEmail = async (to, verificationToken) => {
  const verifyUrl = `http://localhost:3000/api/auth/verify/${verificationToken}`;

  const emailOptions = {
    from: UKR_NET_USER,
    to,
    subject: "Email Verification",
    html: `<p>Click to verify your email: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
  };

  await transporter.sendMail(emailOptions);
};
