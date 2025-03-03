const mongoose=require("mongoose");
const { Schema } = mongoose;
const employeeSchema = new mongoose.Schema({
    name:String,
    dob:String,
    email:String,
    phone:String,
    address:String,
    education:{
        ssc:String,
        hsc:String,
        diploma:String,
        graduation:String
    },

    officialDetails:{
        empId:String,
        department:String,
        designation:String,
        salary:String,
        joiningDate:String,
    },
   
});
const Employee=mongoose.model("employees",employeeSchema);
module.exports = Employee;