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

        const checkIn = await CheckInOut.findOne({ employeeId, checkOutTime: null }).sort({ checkInTime: -1 });

        if (!checkIn) return res.status(400).json({ message: "❌ No active check-in found" });

        checkIn.checkOutTime = new Date();

        // Calculate total pause duration
        let totalPausedDuration = 0;
        checkIn.pauses.forEach(pause => {
            if (pause.pauseTime && pause.resumeTime) {
                totalPausedDuration += pause.resumeTime.getTime() - pause.pauseTime.getTime();
            }
        });

        checkIn.duration = Math.round((checkIn.checkOutTime.getTime() - checkIn.checkInTime.getTime() - totalPausedDuration) / 60000);
        await checkIn.save();

        res.json({ message: "✅ Checked out successfully", checkIn });
    } catch (error) {
        res.status(500).json({ message: "❌ Error checking out", error: error.message });
    }
});


// ✅ Employee Pause Work
router.post("/pause", async (req, res) => {
    try {
        const { employeeId } = req.body;

        const checkIn = await CheckInOut.findOne({ employeeId, checkOutTime: null }).sort({ checkInTime: -1 });

        if (!checkIn) return res.status(400).json({ message: "❌ No active check-in found to pause" });

        checkIn.pauses.push({ pauseTime: new Date() });
        await checkIn.save();

        res.json({ message: "✅ Work paused successfully", checkIn });
    } catch (error) {
        res.status(500).json({ message: "❌ Error pausing work", error: error.message });
    }
});


// ✅ Employee Resume Work
router.post("/resume", async (req, res) => {
    try {
        const { employeeId } = req.body;

        const checkIn = await CheckInOut.findOne({ employeeId, checkOutTime: null, "pauses.pauseTime": { $exists: true }, "pauses.resumeTime": null }).sort({ checkInTime: -1 });

        if (!checkIn) return res.status(400).json({ message: "❌ No paused work found to resume" });

        // Update last pause entry
        checkIn.pauses[checkIn.pauses.length - 1].resumeTime = new Date();
        await checkIn.save();

        res.json({ message: "✅ Work resumed successfully", checkIn });
    } catch (error) {
        res.status(500).json({ message: "❌ Error resuming work", error: error.message });
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

// ✅ Fetch Check-in/Check-out History by Date Range
router.get("/history/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { startDate, endDate } = req.query;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "❌ Invalid Employee ID" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1); // Include the end date

        const history = await CheckInOut.find({
            employeeId: employeeId,
            checkInTime: { $gte: start, $lt: end }
        }).sort({ checkInTime: -1 });

        if (!history.length) {
            return res.status(404).json({ message: "❌ No check-in/out records found for the given date range" });
        }

        res.json({ message: "✅ History fetched successfully", history });
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching history", error: error.message });
    }
});

module.exports = router;