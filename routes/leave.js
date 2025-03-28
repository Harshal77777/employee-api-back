const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const Leaves = require('../models/leave.js');

// 🟢 Submit a leave request (Employee)
router.post('/', async (req, res) => {
  try {
    const { email, reason, fromDate, toDate, type } = req.body;
    
    if (!email || !reason || !fromDate || !toDate || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const employee = await User.findOne({ email });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const newLeave = new Leaves({  
      email,
      reason,
      fromDate,
      toDate,
      type,
      status: 'pending'
    });

    await newLeave.save();
    res.status(201).json({ message: 'Leave request submitted successfully', leave: newLeave });

  } catch (error) {
    console.error('Error submitting leave request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🟢 Fetch all leave requests (Admin)
router.get('/all', async (req, res) => {
  try {
    const leaves = await Leaves.find();
    res.status(200).json(leaves);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🟢 Fetch leave requests for a specific employee
router.get('/employee/:email', async (req, res) => {
  try {
    const leaves = await Leaves.find({ email: req.params.email });
    if (!leaves.length) {
      return res.status(404).json({ message: 'No leave requests found for this employee' });
    }
    res.json(leaves);
  } catch (error) {
    console.error('Error fetching employee leave requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🟢 Update leave request status (Admin)
router.put('/update/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leaves.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.json({ message: 'Leave status updated successfully', leave });

  } catch (error) {
    console.error('Error updating leave status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
