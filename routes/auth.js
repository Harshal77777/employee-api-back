const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// routes/auth.js
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ error: "User not found" });
    }
    // Add these debug logs
    console.log('User found:', user);
    console.log('Stored password hash:', user.password);
    // const isMatch = await bcrypt.compare(password, user.password);
      // Add this password validation before comparison
      if (!user.password) {
        console.log('Password hash is missing for user:', email);
        return res.status(400).json({ error: "Account issue. Please contact support." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for:', email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Add this log to debug role
    console.log('User role:', user.role);

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Send role in response
    res.json({ 
      token, 
      role: user.role,
      message: `Logged in successfully as ${user.role}`
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Remove or disable the public register route
// Instead, create a protected route for admin to create users:

const authMiddleware = require('../middleware/auth'); // Create this middleware

router.post("/create-user", authMiddleware, async (req, res) => {
  try {
    // Check if the requesting user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can create users" });
    }

    const { email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
