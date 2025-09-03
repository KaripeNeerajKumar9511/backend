import { transporter } from "./storage.js";

async function testMail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Nodemailer Test",
      text: "If you see this, Gmail SMTP is working 🚀",
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

testMail();
