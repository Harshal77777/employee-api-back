const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

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
app.use("/api/auth", authRoutes);
app.use("/employee",employeeRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));