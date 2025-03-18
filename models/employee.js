const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: String,
    dob: String,
    email: { type: String, unique: true, required: true },
    phone: String,
    address: String,
    graduation: String,
    designation: String,
    salary: String,
    joiningDate: String,
    marksheet: String,  
    resume: String,
    leaveBalance: { type: Number, default: 10 } 
});

// 🔹 Check if the model is already defined, if so, use it instead of redefining
const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

module.exports = Employee;
