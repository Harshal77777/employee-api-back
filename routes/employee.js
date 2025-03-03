const express = require("express");
const {
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    getAllEmployees
} = require("../handlers/employee-handler");

const router = express.Router();

// Add employee
router.post("/", async (req, res) => {
    try {
        const model = req.body;
        const employee = await addEmployee(model);
        res.status(201).send(employee);
    } catch (error) {
        res.status(500).send({ message: "Error adding employee", error: error.message });
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
