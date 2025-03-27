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
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Add Employee with File Upload
router.post("/", upload.fields([{ name: "marksheet" }, { name: "resume" }]), async (req, res) => {
    try {
        const model = req.body;
        
        // ✅ Ensure req.files exists before accessing properties
        model.marksheet = req.files && req.files["marksheet"] ? req.files["marksheet"][0].filename : "";
        model.resume = req.files && req.files["resume"] ? req.files["resume"][0].filename : "";

        const employee = await addEmployee(model);
        res.status(201).json(employee);
    } catch (error) {
        console.error("Upload Error:", error); // Log the full error for debugging
        res.status(500).json({ message: "Error adding employee", error: error.message });
    }
});




// ✅ Update employee
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // ✅ Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid Employee ID" });
        }

        const model = req.body;
        const updatedEmployee = await updateEmployee(id, model);

        if (!updatedEmployee) {
            return res.status(404).send({ message: "Employee not found" });
        }

        res.status(200).send({ message: "Employee updated successfully", employee: updatedEmployee });
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