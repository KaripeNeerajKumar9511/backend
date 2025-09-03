import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cors from "cors";
// import skillvedhikaLogo from "../logos/Skillvedhika.png";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (for JSON body parsing)
app.use(express.json());
app.use(cors());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // 👈 bypass self-signed cert check
    },
});

// Example route
app.get("/", (req, res) => {
    res.send("API is running...");
});

console.log(process.env.EMAIL_PASS)
console.log(process.env.EMAIL_USER)

// Route to send email
app.post("/send-email", async (req, res) => {
  try {
    const { name , email, phone } = req.body;

    if (!name || !email || !phone ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Thank you mail to the user
    const userMailOptions = {
      from: `"Snowflake Booking" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank You for Your Booking!",
      html: `
        <div style="background-color:#f4f6f8; padding:30px; font-family: Arial, sans-serif; color:#333;">
          <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; padding:30px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            
            <!-- Logo -->
            <img src="https://res.cloudinary.com/srinivascloud/image/upload/v1756803072/WhatsApp_Image_2025-09-02_at_14.17.48_ed36efa3_jeubsp.jpg" alt="Snowflake Logo" style="height:60px; margin-bottom:20px;" />
           
            <!-- Title -->
            <h2 style="color:#005bac; margin-bottom:10px;">Thank You for Your Booking 🎉</h2>
            <p style="font-size:16px; margin-bottom:25px;">
              Hello <strong>${name} </strong>,
            </p>
    
            <!-- Message -->
            <p style="font-size:15px; line-height:1.6; margin-bottom:30px;">
              We’re excited to have you join our <span style="color:#005bac; font-weight:bold;">Snowflake Training</span>.  
              Our team will connect with you shortly with the next steps.
            </p>
    
            <!-- Footer -->
            <p style="font-size:14px; color:#666; margin-top:20px;">
              Best Regards,<br/>
              <strong>SkillVedika Team</strong>
            </p>
          </div>
        </div>
      `,
    };
    

    // Admin mail with details
    const adminMailOptions = {
      from: `"Snowflake Enrollment" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Enrollment Submission",
      html: `
        <h2>New Enrollment Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        
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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});