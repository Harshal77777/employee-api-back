const express = require("express");
const Leave = require("../models/leave"); // Ensure correct capitalization
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// 🔍 Debugging - Check if environment variables are loaded
console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS);

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Test API route
router.get("/", (req, res) => {
  console.log("🔵 GET /api/leave called");
  res.status(200).json({ message: "Leave API is working" });
});

// ✅ Apply Leave Route (Only One Definition)
router.post("/applyleave", async (req, res) => {
  console.log("🔵 Received Request:", req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is missing or empty" });
  }

  const { employeeId, reason, date } = req.body;

  if (!employeeId || !reason || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Save leave request to database
    const newLeave = new Leave({ employeeId, reason, date, status: "Pending" });
    await newLeave.save();

    // ✅ Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "admin@gmail.com",
      subject: "New Leave Request Submitted",
      html: `
        <h2>New Leave Request</h2>
        <p><strong>Employee ID:</strong> ${employeeId}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Status:</strong> Pending</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email Error:", error);
        return res.status(500).json({ message: "Leave request submitted, but email not sent" });
      } else {
        console.log("✅ Email Sent:", info.response);
        return res.status(200).json({ message: "Leave request submitted and email sent" });
      }
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
