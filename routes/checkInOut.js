const express = require("express");
const CheckInOut = require("../models/checkInOut");

const router = express.Router();

// Employee Check-in
router.post("/check-in", async (req, res) => {
    try {
        const { employeeId } = req.body;
        const checkIn = new CheckInOut({ employeeId, checkInTime: new Date() });
        await checkIn.save();
        res.status(201).json({ message: "Checked in successfully", checkIn });
    } catch (error) {
        res.status(500).json({ message: "Error checking in", error: error.message });
    }
});

// Employee Check-out
router.post("/check-out", async (req, res) => {
    try {
        const { employeeId } = req.body;
        const checkIn = await CheckInOut.findOne({ employeeId, checkOutTime: null });

        if (!checkIn) {
            return res.status(400).json({ message: "No active check-in found" });
        }

        checkIn.checkOutTime = new Date();
        checkIn.duration = checkIn.checkOutTime - checkIn.checkInTime;  // Calculate duration
        await checkIn.save();

        res.json({ message: "Checked out successfully", checkIn });
    } catch (error) {
        res.status(500).json({ message: "Error checking out", error: error.message });
    }
});

// Get Check-in/Check-out History
router.get("/history/:employeeId", async (req, res) => {
    try {
        const { employeeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "Invalid employee ID format" });
        }

        const history = await CheckInOut.find({ employeeId }).sort({ createdAt: -1 });

        if (!history.length) {
            return res.status(404).json({ message: "No check-in/out history found" });
        }

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error: error.message });
    }
});

// Download Check-in/Check-out History as CSV
router.get("/download/:employeeId", async (req, res) => {
    try {
        const history = await CheckInOut.find({ employeeId: req.params.employeeId });

        let csv = "Check-In Time,Check-Out Time,Duration (Minutes)\n";
        history.forEach(record => {
            const checkIn = record.checkInTime.toISOString();
            const checkOut = record.checkOutTime ? record.checkOutTime.toISOString() : "N/A";
            const duration = record.duration ? (record.duration / 60000).toFixed(2) : "N/A";  // Convert ms to minutes
            csv += `${checkIn},${checkOut},${duration}\n`;
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=checkin-history.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: "Error generating CSV", error: error.message });
    }
});

module.exports = router;
