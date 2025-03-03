const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: String,
  phone: String,
  address: String,
  education: {
    tenth: Number,
    twelfth: Number,
    diploma: String,
    degree: String
  },
  officialDetails: {
    employeeId: String,
    department: String,
    designation: String,
    joiningDate: Date
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
