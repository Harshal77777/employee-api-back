const express = require("express");
const multer = require("multer");
const path = require("path");

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
        cb(null, "uploads/");  // Store files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// Add Employee with File Upload
router.post("/", upload.fields([{ name: "marksheet" }, { name: "resume" }]), async (req, res) => {
    try {
        const model = req.body;
        model.marksheet = req.files["marksheet"] ? req.files["marksheet"][0].filename : "";
        model.resume = req.files["resume"] ? req.files["resume"][0].filename : "";

        const employee = await addEmployee(model);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error adding employee", error: error.message });
    }
});


// Update employee
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const model = req.body;
        const updated = await updateEmployee(id, model);
        if (!updated) {
            return res.status(404).send({ message: "Employee not found" });
        }
        res.send({ message: "Employee updated successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error updating employee", error: error.message });
    }
});

// Delete employee
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await deleteEmployee(id);
        if (!deleted) {
            return res.status(404).send({ message: "Employee not found" });
        }
        res.send({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting employee", error: error.message });
    }
});

// Get single employee by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const employee = await getEmployee(id);
        if (!employee) {
            return res.status(404).send({ message: "Employee not found" });
        }
        res.send(employee);
    } catch (error) {
        res.status(500).send({ message: "Error fetching employee", error: error.message });
    }
});

// Get all employees
router.get("/", async (req, res) => {
    try {
        const employee = await getAllEmployees();
        res.send(employee); // [] if no employees exist
    } catch (error) {
        res.status(500).send({ message: "Error fetching employees", error: error.message });
    }
});

module.exports = router;
