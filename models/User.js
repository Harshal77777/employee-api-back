const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true, unique: true }, // Added mobile number
    otp: { type: String },
    otpExpires: { type: Date },
    isAdmin: { type: Boolean, default: false },
    resetToken: { type: String },  // ✅ Added reset token
    resetTokenExpires: { type: Date }  // ✅ Expiry time
});

module.exports = mongoose.model("User", userSchema);
