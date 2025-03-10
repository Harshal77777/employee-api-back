const express = require("express");
const Attendance = require("../models/attendance");
const QRCode = require("qrcode");

const router = express.Router();

// Check-in
router.post("/checkin", async (req, res) => {
    try {
        const { employeeId } = req.body;
        const qrCodeUrl = await QRCode.toDataURL(employeeId);

        const attendance = new Attendance({
            employeeId,
            checkInTime: new Date(),
            qrCode: qrCodeUrl,
        });

        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error checking in", error: error.message });
    }
});

// Check-out
router.put("/checkout/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await Attendance.findById(id);
        if (!attendance) return res.status(404).json({ message: "Check-in record not found" });

        attendance.checkOutTime = new Date();
        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error checking out", error: error.message });
    }
});

// Get all attendance records
router.get("/", async (req, res) => {
    try {
        const records = await Attendance.find().populate("employeeId");
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance records", error: error.message });
    }
});

module.exports = router;
