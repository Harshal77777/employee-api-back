const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
//   name: String,
//   dateOfJoining: Date,
//   endDate: Date,
//   documents: {
//     offerLetter: String,
//     adharCard: String,
//     panCard: String,
//     tenthCertificate: String,
//     twelfthCertificate: String,
//     graduationCertificate: String
//   },
//   mobileNumber: String,
//   officeEmail: String,
//   personalEmail: String,
//   salary: Number,
//   project: String,
//   reportingManager: String
// });
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);