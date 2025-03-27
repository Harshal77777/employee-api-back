const express = require("express");
const { 
  registerUser, 
  loginUser, 
  verifyOtp, 
  forgotPassword,  // ✅ Ensure this is imported
  resetPassword 
} = require("../handlers/auth-handler"); 
const router = express.Router();

// ✅ User Registration Route (Now Includes Mobile Number)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Validate required fields
    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ error: "Please provide name, email, password, and mobile number" });
    }

    // Basic Mobile Validation (10 Digits)
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: "Invalid mobile number. Must be 10 digits." });
    }

    await registerUser({ name, email, password, mobile });
    res.status(201).json({ message: "User Registered! OTP sent to email." });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// ✅ OTP Verification Route (Returns Token)
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const result = await verifyOtp(email, otp);
    res.json(result);
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);
    res.status(400).json({ error: error.message || "Invalid OTP" });
  }
});


// ✅ Login Route (Fixed Function Call)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    const result = await loginUser(email, password); // 🔥 FIXED
    res.json(result);
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(400).json({ error: error.message || "Invalid Credentials" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    res.json(await forgotPassword(req.body.email)); // ✅ Now it will work
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: "No token provided." });
    }

    console.log("Received Reset Token:", token); // ✅ Debugging

    const result = await resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    console.error("❌ Reset Password Error:", error.message);
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;