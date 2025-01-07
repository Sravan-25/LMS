const express = require('express');
const BugController = require('../Controllers/bugController');
const router = express.Router();

// Routes for bug tracking
router.post('/bugcreate', BugController.createBug); // Create a bug
router.get('/display-bugs', BugController.getBugs); // Fetch all bugs
router.get('/display-bug/:id', BugController.getBugById); // Fetch a bug by ID
router.get('/updatebug/:id', BugController.updateBug); // Update a bug by ID
router.get('/deletebug/:id', BugController.deleteBug); // Delete a bug by ID
router.get('/bug-page', BugController.renderBugPage); // Render the bug page
router.get('/get-staff', BugController.getStaff); // Fetch staff members

module.exports = router;
