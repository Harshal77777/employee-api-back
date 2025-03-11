const express = require("express");
const Leave = require("../models/leave");
const Employee = require("../models/employee"); // ✅ Import Employee model
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/applyleave", async (req, res) => {
  console.log("🔵 Received Request:", req.body);

  const { email, reason, date } = req.body;

  if (!email || !reason || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Find employee by email
    const employee = await Employee.findOne({ email });

    if (!employee) {
      console.log("❌ Employee not found",email);
      return res.status(404).json({ message: "Employee not found" });
    }

    // ✅ Save leave request
    const newLeave = new Leave({
      employeeId: employee._id, // ✅ Now using _id as employee ID
      reason,
      date,
      status: "Pending",
    });

    await newLeave.save();
    
    // ✅ Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "vishalchaudhari4530@gmail.com",
      subject: "New Leave Request Submitted",
      html: `
        <h2>New Leave Request</h2>
        <p><strong>Employee Name:</strong> ${employee.name}</p>
        <p><strong>Email:</strong> ${employee.email}</p>
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
