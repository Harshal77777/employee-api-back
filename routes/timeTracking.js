const express = require("express");
const TimeTracking = require("../models/timeTracking");
const router = express.Router();
const { Parser } = require("json2csv");

// Check-In
router.post("/check-in", async (req, res) => {
    try {
        const { employeeId } = req.body;

        // Check if the user has already checked in and not checked out
        const existingCheckIn = await TimeTracking.findOne({ employeeId, checkOutTime: null });

        if (existingCheckIn) {
            return res.status(400).json({ message: "Already checked in. Please check out first." });
        }

        const checkIn = new TimeTracking({ employeeId, checkInTime: new Date() });
        await checkIn.save();

        res.status(201).json({ message: "Checked in successfully", checkIn });
    } catch (error) {
        res.status(500).json({ message: "Error checking in", error: error.message });
    }
});

// Check-Out
router.post("/check-out", async (req, res) => {
    try {
        const { employeeId } = req.body;

        const checkInRecord = await TimeTracking.findOne({ employeeId, checkOutTime: null });

        if (!checkInRecord) {
            return res.status(400).json({ message: "No active check-in found." });
        }

        checkInRecord.checkOutTime = new Date();
        checkInRecord.totalTime = (checkInRecord.checkOutTime - checkInRecord.checkInTime) / 1000; // Convert to seconds
        await checkInRecord.save();

        res.status(200).json({ message: "Checked out successfully", checkOut: checkInRecord });
    } catch (error) {
        res.status(500).json({ message: "Error checking out", error: error.message });
    }
});

// Get Employee Time History
router.get("/:employeeId/history", async (req, res) => {
    try {
        const { employeeId } = req.params;
        const history = await TimeTracking.find({ employeeId });

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error: error.message });
    }
});

// Download CSV Report
router.get("/download/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;
        const records = await TimeTracking.find({ employeeId });

        if (records.length === 0) {
            return res.status(404).json({ message: "No records found." });
        }

        const fields = ["employeeId", "checkInTime", "checkOutTime", "totalTime"];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(records);

        res.header("Content-Type", "text/csv");
        res.attachment("time_tracking_report.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: "Error downloading report", error: error.message });
    }
});

module.exports = router;
