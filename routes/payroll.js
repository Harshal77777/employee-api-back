const express = require("express");
const Payroll = require("../models/Payroll");

const router = express.Router();

// Add Payroll Record
router.post("/add", async (req, res) => {
  try {
    const { employeeId, basicSalary, deductions, bonuses } = req.body;
    const netSalary = basicSalary - deductions + bonuses;

    const payroll = new Payroll({ employeeId, basicSalary, deductions, bonuses, netSalary });
    await payroll.save();

    res.status(201).json({ message: "Payroll record added successfully", payroll });
  } catch (error) {
    res.status(500).json({ error: "Failed to add payroll record" });
  }
});

// Get All Payroll Records
router.get("/", async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate("employeeId", "name email");
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payroll records" });
  }
});

// Get Payroll by Employee ID
router.get("/:employeeId", async (req, res) => {
  try {
    const payroll = await Payroll.findOne({ employeeId: req.params.employeeId });
    if (!payroll) return res.status(404).json({ error: "Payroll record not found" });

    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payroll record" });
  }
});

// Update Payroll Record
router.put("/update/:id", async (req, res) => {
  try {
    const { basicSalary, deductions, bonuses } = req.body;
    const netSalary = basicSalary - deductions + bonuses;

    const payroll = await Payroll.findByIdAndUpdate(req.params.id, { basicSalary, deductions, bonuses, netSalary }, { new: true });

    if (!payroll) return res.status(404).json({ error: "Payroll record not found" });

    res.status(200).json({ message: "Payroll record updated successfully", payroll });
  } catch (error) {
    res.status(500).json({ error: "Failed to update payroll record" });
  }
});

// Delete Payroll Record
router.delete("/delete/:id", async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) return res.status(404).json({ error: "Payroll record not found" });

    res.status(200).json({ message: "Payroll record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete payroll record" });
  }
});

module.exports = router;
