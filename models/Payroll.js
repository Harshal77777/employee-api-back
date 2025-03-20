const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  basicSalary: { type: Number, required: true },
  deductions: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payroll", PayrollSchema);
