const express = require('express');
const mongoose = require('mongoose');
const Leave = require('../models/Leave'); // Leave model
const Employee = require('../models/Employee'); // Employee model

const router = express.Router();

// ✅ Employee Applies for Leave
router.post('/applyleave', async (req, res) => {
    const { employeeId, reason, date } = req.body;

    try {
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: "❌ Employee not found" });
        }

        // 🔹 Check if employee has leave balance
        if (employee.leaveBalance <= 0) {
            return res.status(400).json({ message: "❌ Insufficient leave balance" });
        }

        // 🔹 Create a new leave request
        const newLeave = new Leave({
            employeeId: employee._id,
            reason,
            date,
            status: 'Pending'
        });

        await newLeave.save();
        res.status(201).json({ message: "✅ Leave request submitted!", leave: newLeave });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "❌ Server error", error });
    }
});

// ✅ Get Pending Leave Requests for Admin
router.get('/all', async (req, res) => {
    try {
        const leaves = await Leave.find({ status: "Pending" }).populate('employeeId', 'name email leaveBalance');
        res.status(200).json(leaves);
    } catch (error) {
        console.error("❌ Error fetching leave requests:", error);
        res.status(500).json({ message: "❌ Server error", error });
    }
});

// ✅ Admin Approves/Rejects Leave
router.put('/update/:leaveId', async (req, res) => {
    const { status } = req.body;
    const { leaveId } = req.params;

    try {
        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return res.status(404).json({ message: "❌ Leave request not found" });
        }

        // 🔹 Fetch Employee
        const employee = await Employee.findById(leave.employeeId);
        if (!employee) {
            return res.status(404).json({ message: "❌ Employee not found" });
        }

        // 🔹 If approved, deduct leave balance
        if (status === "Approved") {
            if (employee.leaveBalance > 0) {
                employee.leaveBalance -= 1;  // Deduct 1 leave
                await employee.save();
            } else {
                return res.status(400).json({ message: "❌ No leave balance left" });
            }
        }

        // 🔹 Update leave request status
        leave.status = status;
        await leave.save();

        res.status(200).json({ message: `✅ Leave ${status}`, updatedLeave: leave });

    } catch (error) {
        console.error("❌ Error updating leave status:", error);
        res.status(500).json({ message: "❌ Server error", error });
    }
});

module.exports = router;
