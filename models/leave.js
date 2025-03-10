const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Leave", leaveSchema);
