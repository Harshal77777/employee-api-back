const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/leave.js'); // Mongoose model
const employeeSchema = require('../models/employee.js');
const userSchema = require('../models/User.js');


router.post('/', async (req, res) => { 
  try {
    const { employeeId, reason, date } = req.body;
    console.log('Received Leave Request:', req.body);

    if (!employeeId || !reason || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if employee exists
    const employee = await userSchema.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const newLeave =  new LeaveRequest({ employeeId, reason, date, status: 'pending' });

    // ✅ Use `await` to ensure the document is saved before responding
    await newLeave.save();

    res.status(201).json({ message: 'Leave request submitted successfully' });

  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }  
});



router.get('/all', async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find();  // ✅ Fetch all leave requests
    return res.status(200).json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ Fetch employee's own leave requests
router.get('/employee/:id', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employeeId: req.params.id });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leave requests' });
  }
});router.get('/employee/:id', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employeeId: req.params.id }).exec();

    if (!leaves || leaves.length === 0) {
      return res.status(404).json({ message: 'No leave requests found for this employee' });
    }

    res.json(leaves);
  } catch (error) {
    console.error('Error fetching employee leave requests:', error);
    res.status(500).json({ error: 'Error fetching leave requests' });
  }
});
router.put('/update/:id', async (req, res) => {
  try {
    console.log("Received ID:", req.params.id);
    console.log("Request Body:", req.body);

    const leaveId = req.params.id;

    const { status } = req.body;

    // ✅ Validate status
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      console.log("Invalid status received:", status);
      return res.status(400).json({ error: 'Invalid status' });
    }

    // ✅ Find leave request
    const leaveRequest = await LeaveRequest.findById(leaveId);
    
    if (!leaveRequest) {
      console.log("Leave request not found for ID:", leaveId);
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // ✅ Update status and save
    leaveRequest.status = status;
    await leaveRequest.save();

    res.json({ message: 'Leave status updated', leaveRequest });
  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
