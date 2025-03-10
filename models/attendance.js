const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employees", required: true },
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date },
    qrCode: { type: String }, // Store the QR code URL
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
