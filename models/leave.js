
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  email:{type:String},
  employeeId: {
    type: String, required: true
  },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Leaves', leaveSchema);

