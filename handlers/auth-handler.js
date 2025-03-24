// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const employee = require("../models/employee");


// async function registerUser(model) {
//   const hashPassword = await bcrypt.hash(model.password, 10);
//   const user = new User({
//     name: model.name,
//     email: model.email,
//     password: hashPassword,
//     isAdmin: model.isAdmin || false, // Default isAdmin to false
//   });

//   await user.save();
// }

// async function loginUser(model) {
//   const user = await User.findOne({ email: model.email });
//   if (!user) {
//     return null;
//   }

//   const isMatched = await bcrypt.compare(model.password, user.password);
//   if (isMatched) {
//     const token = jwt.sign(
//       {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         isAdmin: user.isAdmin,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     return { token, user };
//   } else {
//     return null;
//   }
// }

// module.exports = { registerUser, loginUser };
//////////////////////////////////////////

// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// // ✅ Ensure email credentials are present
// if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//   console.error("❌ Missing email credentials in .env file!");
//   process.exit(1);
// }

// // 📧 Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /**
//  * ✅ Function to send OTP via email
//  */
// const sendOtpEmail = async (email, otp) => {
//   try {
//     if (!email) throw new Error("❌ Email is missing in sendOtpEmail!");

//     await transporter.sendMail({
//       from: `"Your App Name" <${process.env.EMAIL_USER}>`, // ✅ Ensures FROM is valid
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
//     });

//     console.log(`✅ OTP email sent to: ${email}`);
//   } catch (error) {
//     console.error("❌ Error sending OTP email:", error.message);
//   }
// };

// /**
//  * ✅ Function to register a new user
//  */
// const registerUser = async (model) => {
//   try {
//     const { name, email, password } = model;

//     // 🔍 Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) throw new Error("❌ User already exists with this email.");

//     // 🔐 Encrypt password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 🔢 Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // 💾 Save user to database
//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       otp,
//       otpExpires,
//     });

//     await user.save();
//     console.log(`✅ User registered: ${email}`);

//     // 📧 Send OTP email
//     await sendOtpEmail(email, otp);
//   } catch (error) {
//     console.error("❌ Registration Error:", error.message);
//     throw new Error(error.message);
//   }
// };


// const loginUser = async (model) => {
//   const { email, password } = model;
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     throw new Error("Invalid Credentials");
//   }

//   return { message: "Login Successful", user };
// };

// /**
//  * ✅ Function to verify OTP
//  */
// const verifyOtp = async (email, otp) => {
//   try {
//     const user = await User.findOne({ email });

//     if (!user) throw new Error("❌ User not found.");

//     // ⏳ Check if OTP is valid
//     if (user.otp !== otp || user.otpExpires < Date.now()) {
//       throw new Error("❌ Invalid or expired OTP.");
//     }

//     // 🗑️ Clear OTP after successful verification
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     console.log(`✅ OTP verified for: ${email}`);
//   } catch (error) {
//     console.error("❌ OTP Verification Error:", error.message);
//     throw new Error(error.message);
//   }
// };

// module.exports = { registerUser, verifyOtp,loginUser };







// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const JWT_SECRET = process.env.JWT_SECRET;


// if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !JWT_SECRET) {
//   console.error("❌ Missing required environment variables in .env file!");
//   process.exit(1);
// }


// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });


// const sendOtpEmail = async (email, otp) => {
//   try {
//     await transporter.sendMail({
//       from: `"Your App Name" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
//     });

//     console.log(`✅ OTP email sent to: ${email}`);
//   } catch (error) {
//     console.error("❌ Error sending OTP email:", error.message);
//   }
// };
// const sendResetEmail = async (email, resetToken) => {
//   try {
//     const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
//     await transporter.sendMail({
//       from: `"Your App" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Reset Your Password",
//       text: `Click the link to reset your password: ${resetLink}. It expires in 1 hour.`
//     });
//     console.log(`✅ Password reset email sent to: ${email}`);
//   } catch (error) {
//     console.error("❌ Error sending reset email:", error.message);
//   }
// };


// const registerUser = async (model) => {
//   try {
//     const { name, email, password, mobile } = model;

//     if (!name || !email || !password || !mobile) {
//       throw new Error("❌ Please provide name, email, password, and mobile number.");
//     }

//     if (!/^\d{10}$/.test(mobile)) {
//       throw new Error("❌ Invalid mobile number. Must be 10 digits.");
//     }

//     let user = await User.findOne({ $or: [{ email }, { mobile }] });
//     if (user) {
//       throw new Error("❌ User already exists.");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       mobile,
//       otp,
//       otpExpires,
//     });

//     await user.save();
//     await sendOtpEmail(email, otp);
//   } catch (error) {
//     console.error("❌ Registration Error:", error.message);
//     throw new Error(error.message);
//   }
// };

// const forgotPassword = async (email) => {
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new Error("❌ User not found.");
//     }

//     const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
//     user.resetToken = resetToken;
//     user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
//     await user.save();

//     await sendResetEmail(email, resetToken);
//     return { message: "✅ Reset email sent!" };
//   } catch (error) {
//     console.error("❌ Forgot Password Error:", error.message);
//     throw new Error(error.message);
//   }
// };

// // ✅ Reset Password (Verify Token & Update Password)
// const resetPassword = async (token, newPassword) => {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findOne({ _id: decoded.id, resetToken: token });

//     if (!user || user.resetTokenExpires < Date.now()) {
//       throw new Error("❌ Invalid or expired reset token.");
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetToken = null;
//     user.resetTokenExpires = null;
//     await user.save();

//     return { message: "✅ Password reset successful!" };
//   } catch (error) {
//     console.error("❌ Reset Password Error:", error.message);
//     throw new Error(error.message);
//   }
// };

// module.exports = { registerUser, loginUser, verifyOtp, forgotPassword, resetPassword };  





// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const JWT_SECRET = process.env.JWT_SECRET;
// const FRONTEND_URL = process.env.FRONTEND_URL; // Ensure this exists in .env

// // ✅ Ensure required environment variables exist
// if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !JWT_SECRET || !FRONTEND_URL) {
//   console.error("❌ Missing required environment variables in .env file!");
//   process.exit(1);
// }

// // 📧 Nodemailer transporter setup
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // ✅ Function to send OTP via email
// const sendOtpEmail = async (email, otp) => {
//   try {
//     await transporter.sendMail({
//       from: `"Your App Name" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP Code",
//       text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
//     });

//     console.log(`✅ OTP email sent to: ${email}`);
//   } catch (error) {
//     console.error("❌ Error sending OTP email:", error.message);
//   }
// };

// // ✅ Function to send password reset email
// const sendResetEmail = async (email, resetToken) => {
//   try {
//     const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
//     await transporter.sendMail({
//       from: `"Your App" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Reset Your Password",
//       text: `Click the link to reset your password: ${resetLink}. It expires in 1 hour.`,
//     });

//     console.log(`✅ Password reset email sent to: ${email}`);
//   } catch (error) {
//     console.error("❌ Error sending reset email:", error.message);
//   }
// };

// // ✅ Register User
// const registerUser = async (model) => {
//   try {
//     const { name, email, password, mobile } = model;

//     if (!name || !email || !password || !mobile) {
//       throw new Error("❌ Please provide name, email, password, and mobile number.");
//     }

//     if (!/^\d{10}$/.test(mobile)) {
//       throw new Error("❌ Invalid mobile number. Must be 10 digits.");
//     }

//     let user = await User.findOne({ $or: [{ email }, { mobile }] });
//     if (user) {
//       throw new Error("❌ User already exists.");
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       mobile,
//       otp,
//       otpExpires,
//     });

//     await user.save();
//     await sendOtpEmail(email, otp);

//     return { message: "✅ Registration successful! Please verify your OTP." };
//   } catch (error) {
//     console.error("❌ Registration Error:", error.message);
//     throw new Error(error.message);
//   }
// };

// // ✅ Login User
// const loginUser = async (email, password) => {
//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       throw new Error("❌ User not found.");
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       throw new Error("❌ Invalid credentials.");
//     }

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

//     return { message: "✅ Login successful!", token };
//   } catch (error) {
//     console.error("❌ Login Error:", error.message);
//     throw new Error(error.message);
//   }
// };

// // ✅ Verify OTP
// const verifyOtp = async (email, otp) => {
//   try {
//     const user = await User.findOne({ email });

//     if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
//       throw new Error("❌ Invalid or expired OTP.");
//     }

//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     return { message: "✅ OTP verified successfully!" };
//   } catch (error) {
//     console.error("❌ OTP Verification Error:", error.message);
//     throw new Error(error.message);
//   }
// };

// // ✅ Forgot Password (Generate Token & Send Email)
// const forgotPassword = async (email) => {
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new Error("❌ User not found.");
//     }

//     const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
//     user.resetToken = resetToken;
//     user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
//     await user.save();

//     await sendResetEmail(email, resetToken);
//     return { message: "✅ Reset email sent!" };
//   } catch (error) {
//     console.error("❌ Forgot Password Error:", error.message);
//     throw new Error(error.message);
//   }
// };

// // ✅ Reset Password (Verify Token & Update Password)
// const resetPassword = async (token, newPassword) => {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findOne({ _id: decoded.id, resetToken: token });

//     if (!user || user.resetTokenExpires < Date.now()) {
//       throw new Error("❌ Invalid or expired reset token.");
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetToken = null;
//     user.resetTokenExpires = null;
//     await user.save();

//     return { message: "✅ Password reset successful!" };
//   } catch (error) {
//     console.error("❌ Reset Password Error:", error.message);
//     throw new Error(error.message);
//   }
// };

// module.exports = { registerUser, loginUser, verifyOtp, forgotPassword, resetPassword };





const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Load environment variables
const { EMAIL_USER, EMAIL_PASS, JWT_SECRET, FRONTEND_URL } = process.env;

if (!EMAIL_USER || !EMAIL_PASS || !JWT_SECRET || !FRONTEND_URL) {
  console.error("❌ Missing required environment variables!");
  process.exit(1);
}

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

// Function to send OTP via email
const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Your App" <${EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    });
    console.log(`✅ OTP email sent to: ${email}`);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error.message);
  }
};

// Function to send password reset email
const sendResetEmail = async (email, resetToken) => {
  try {
    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: `"Your App" <${EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      text: `Click the link to reset your password: ${resetLink}. It expires in 1 hour.`,
    });
    console.log(`✅ Password reset email sent to: ${email}`);
  } catch (error) {
    console.error("❌ Error sending reset email:", error.message);
  }
};

// ✅ Register User
const registerUser = async ({ name, email, password, mobile }) => {
  try {
    if (!name || !email || !password || !mobile) {
      throw new Error("Please provide name, email, password, and mobile number.");
    }

    if (!/^\d{10}$/.test(mobile)) {
      throw new Error("Invalid mobile number. Must be 10 digits.");
    }

    let user = await User.findOne({ $or: [{ email }, { mobile }] });
    if (user) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user = new User({ name, email, password: hashedPassword, mobile, otp, otpExpires });
    await user.save();

    await sendOtpEmail(email, otp);
    return { message: "Registration successful! Please verify your OTP." };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Login User
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials.");

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return { message: "Login successful!", token };
  } catch (error) {
    throw new Error(error.message);
  }
};

// ✅ Verify OTP
const verifyOtp = async (email, otp) => {
  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      throw new Error("Invalid or expired OTP.");
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return { message: "OTP verified successfully!" };
  } catch (error) {
    throw new Error(error.message);
  }
};

const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found.");
    }

    // Generate token with short expiration time (15 mins)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" });

    // Store reset token & expiration time
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();

    console.log("Generated Reset Token:", token); // ✅ Debugging

    // Send reset email
    await sendResetEmail(user.email, token);

    return { message: "Reset link sent to email." };
  } catch (error) {
    throw new Error(error.message);
  }
};


const resetPassword = async (token, newPassword) => {
  try {
    console.log("Received Token for Reset:", token); // ✅ Debugging

    // Verify JWT Token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded Token Data:", decoded); // ✅ Debugging

    // Find the user with matching resetToken
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error("User not found.");
    }

    console.log("User Found:", user.email);
    console.log("Stored Reset Token in DB:", user.resetToken); // ✅ Debugging

    // Check if the stored reset token matches the provided token
    if (user.resetToken !== token) {
      throw new Error("Invalid token.");
    }

    // Check if the reset token is expired
    if (user.resetTokenExpires < Date.now()) {
      throw new Error("Expired reset token.");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password & remove reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    console.log("Password reset successful for:", user.email);

    return { message: "Password reset successful!", email: user.email };
  } catch (error) {
    console.error("❌ Reset Password Error:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { registerUser, loginUser, verifyOtp, forgotPassword, resetPassword };
