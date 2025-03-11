const express = require("express");
const { registerUser, loginUser } = require("../handlers/auth-handler");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const model = req.body;
    if (!model.name || !model.email || !model.password) {
      return res.status(400).json({ error: "Please provide name, email, and password" });
    }

    await registerUser(model);
    res.status(201).json({ message: "User Registered" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const model = req.body;
    if (!model.email || !model.password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    const result = await loginUser(model);
    if (result) {
      return res.json(result);
    } else {
      return res.status(400).json({ error: "Email or Password is incorrect" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
