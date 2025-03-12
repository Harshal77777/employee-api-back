const mongoose = require("mongoose");

const checkInOutSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employees", required: true },
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date },
    duration: { type: Number }  // Duration in milliseconds
}, { timestamps: true });

const CheckInOut = mongoose.model("CheckInOut", checkInOutSchema);
module.exports = CheckInOut;
 
