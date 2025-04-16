
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

app.use(cors());
app.use(cors({ origin: "http://13.235.80.91:4000" }));

// Database Connection with better error handling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");
const checkInOutRoutes = require("./routes/checkInOut");
const leaveRoutes = require("./routes/leave");

app.use("/checkinout", checkInOutRoutes);
app.use("/api/check-in-out", checkInOutRoutes);
// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const { verifyToken, isAdmin } = require("./middleware/auth-middleware");
app.use("/auth", authRoutes);
app.use("/employee",verifyToken, isAdmin,employeeRoutes);
app.use("/api/leave",leaveRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT})`));

