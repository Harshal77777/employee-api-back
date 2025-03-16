const express = require("express");
const mongoose = require("mongoose");
const CheckInOut = require("../models/checkInOut");

const router = express.Router();

// ✅ Employee Check-in
router.post("/check-in", async (req, res) => {
    try {
        const { employeeId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "❌ Invalid Employee ID" });
        }

        const checkIn = new CheckInOut({ employeeId, checkInTime: new Date() });
        await checkIn.save();

        res.status(201).json({ message: "✅ Checked in successfully", checkIn });
    } catch (error) {
        res.status(500).json({ message: "❌ Error checking in", error: error.message });
    }
});

// ✅ Employee Check-out
router.post("/check-out", async (req, res) => {
    try {
        const { employeeId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "❌ Invalid Employee ID" });
        }

        const checkIn = await CheckInOut.findOne({ employeeId, checkOutTime: null });

        if (!checkIn) {
            return res.status(400).json({ message: "❌ No active check-in found" });
        }

        checkIn.checkOutTime = new Date();
        checkIn.duration = Math.round((checkIn.checkOutTime - checkIn.checkInTime) / 60000); // ✅ Convert to minutes
        await checkIn.save();

        res.json({ message: "✅ Checked out successfully", checkIn });
    } catch (error) {
        res.status(500).json({ message: "❌ Error checking out", error: error.message });
    }
});


// ✅ Fetch Check-in/Check-out History
router.get("/history/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "❌ Invalid Employee ID" });
        }

        const history = await CheckInOut.find({ employeeId }).sort({ checkInTime: -1 });

        if (!history.length) {
            return res.status(404).json({ message: "❌ No check-in/out records found" });
        }

        res.json({ message: "✅ History fetched successfully", history });
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching history", error: error.message });
    }
});

module.exports = router;