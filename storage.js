// storage.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log(EMAIL_USER, EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
  },
  tls: {
      rejectUnauthorized: false, // 👈 bypass self-signed cert check
  },
});


// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer Transport Error:", error);
  } else {
    console.log("✅ Nodemailer is ready to send emails");
  }
});
export { transporter };