const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose"); // Ensure mongoose is imported

const {
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    getAllEmployees
} = require("../handlers/employee-handler");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
<<<<<<< HEAD
        cb(null, "uploads/");  // Store files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

=======
        cb(null, "uploads/");  // Store files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file names
    }
});

// ✅ Initialize Multer
>>>>>>> bc4311f7aa9efee012128c5512dcd57a55dccb2e
const upload = multer({ storage });

// ✅ Add Employee with File Upload
router.post("/", upload.fields([{ name: "marksheet" }, { name: "resume" }]), async (req, res) => {
    try {
        const model = req.body;
<<<<<<< HEAD
=======

        // ✅ Correct File Paths
>>>>>>> bc4311f7aa9efee012128c5512dcd57a55dccb2e
        model.marksheet = req.files["marksheet"] ? req.files["marksheet"][0].filename : "";
        model.resume = req.files["resume"] ? req.files["resume"][0].filename : "";

        const employee = await addEmployee(model);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error adding employee", error: error.message });
    }
});

// ✅ Update employee
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Employee ID" });
        }

        const model = req.body;
        const updatedEmployee = await updateEmployee(id, model);

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error: error.message });
    }
});

// ✅ Delete employee
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await deleteEmployee(id);
        if (!deleted) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee", error: error.message });
    }
});

// ✅ Get single employee by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await getEmployee(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employee", error: error.message });
    }
});

// ✅ Get all employees
router.get("/", async (req, res) => {
    try {
        const employees = await getAllEmployees();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error: error.message });
    }
});

module.exports = router;