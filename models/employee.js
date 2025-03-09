const mongoose=require("mongoose");
const { Schema } = mongoose;
const employeeSchema = new mongoose.Schema({
    name:String,
    dob:String,
    email:String,
    phone:String,
    address:String,
    dob:String,
    address:String,
    graduation:String,
    designation:String,
    salary:String,
    joiningDate:String,
    marksheet: String,  
    resume: String 
   
   
});
const Employee=mongoose.model("employees",employeeSchema);
module.exports = Employee;