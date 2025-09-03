// routes.js
import express from "express";
import { transporter } from "./storage.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, experience } = req.body;

    if (!fullName || !email || !phone || !experience) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Thank you mail to the user
    const userMailOptions = {
      from: `"Snowflake Enrollment" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thank You for Your Enrollment!",
      html: `
        <h2>Hello ${fullName},</h2>
        <p>Thank you for enrolling in our Snowflake program. 🎉</p>
        <p>We will contact you shortly.</p>
        <br/>
        <p>Best Regards,<br/>Snowflake Team</p>
      `,
    };

    // Admin mail with details
    const adminMailOptions = {
      from: `"Snowflake Enrollment" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Enrollment Submission",
      html: `
        <h2>New Enrollment Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Experience Level:</strong> ${experience}</p>
      `,
    };

    // Send emails
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    return res.json({ message: "Enrollment successful, emails sent!" });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

export default router;
