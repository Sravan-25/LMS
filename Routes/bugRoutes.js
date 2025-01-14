const express = require('express');
const BugController = require('../Controllers/bugController');
const Staff = require('../models/staffData');
const Bug = require('../models/bugSchema');
const Project = require('../models/projectmodel');
const router = express.Router();

router.get('/Bug-Page', BugController.renderBugPage);
router.post('/create-Bug', BugController.createBugData);
router.get('/all-bugs', BugController.getAllBugs);
router.get('/delete-bug/:id', BugController.deleteBug);
router.post('/update-bug/:id', BugController.updateBug);
router.get("/edit-bug-page/:id", BugController.renderEditBugPage);

// router.get('/edit-bug-page/:id', async (req, res) => {
//   try {
//     const bug = await Bug.findById(req.params.id)
//       .populate('reportedBy', 'firstName lastName')
//       .populate('assignedTo', 'firstName lastName')
//       .populate('project', 'name')
//       .lean();
//     if (!bug) {
//       return res.status(404).send('Bug not found');
//     }
//     const staff = await Staff.find({}).lean();
//     const projects = await Project.find({}).lean();
//     res.render('edit-bug', { bug, staff, projects }); // This renders the form to edit the bug
//   } catch (err) {
//     console.error('Error fetching bug for edit:', err);
//     res.status(500).send('Server Error');
//   }
// });
module.exports = router;
