const Employee = require("../models/employee");

// Add employee
async function addEmployee(model) {
    const employee = new Employee({ ...model });
    await employee.save();
    return employee.toObject();
}

// Update employee
async function updateEmployee(id, model) {
    return await Employee.findByIdAndUpdate(id, model, { new: true, runValidators: true });
}


// Delete employee
async function deleteEmployee(id) {
    const result = await Employee.findByIdAndDelete(id);
    return result ? result.toObject() : null;
}

// Get all employees
async function getAllEmployees() {
    const employees = await Employee.find();
    return employees.map(employee => employee.toObject());
}

// Get single employee
async function getEmployee(id) {
    const employee = await Employee.findById(id);
    return employee ? employee.toObject() : null;
}

module.exports = {
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getAllEmployees,
    getEmployee
};