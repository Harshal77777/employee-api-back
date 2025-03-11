const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");

// const attendanceRoutes = require("./routes/attendance");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200', // Your Angular app's URL
  credentials: true
}));

// Database Connection with better error handling
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log("MongoDB Connected"))
.catch(err => {
  console.error("MongoDB Connection Error:", err);
  process.exit(1);
});

// Routes
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");

const checkInOutRoutes = require("./routes/checkInOut");


app.use("/api/auth", authRoutes);
app.use("/employee", employeeRoutes);
app.use("/checkinout", checkInOutRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const { verifyToken, isAdmin } = require("./middleware/auth-middleware");
app.use("/auth", authRoutes);
app.use("/employee",verifyToken, isAdmin,employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
