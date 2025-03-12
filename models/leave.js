const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    reason: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
});

module.exports = mongoose.model('Leave', LeaveSchema);
