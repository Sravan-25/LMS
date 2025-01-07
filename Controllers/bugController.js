const Staff = require('../models/staffData');
const Bug = require('../models/bugSchema');
const mongoose = require('mongoose');

class BugController {
  static async createBug(req, res) {
    const { title, description, reportedBy, assignedTo, severity, project } =
      req.body;

    try {
      const reportedByStaff = await Staff.findById(reportedBy);
      const assignedToStaff = await Staff.findById(assignedTo);

      if (!reportedByStaff || !assignedToStaff) {
        return res.status(400).json({
          message: 'Error: Reported By or Assigned To staff member not found.',
        });
      }

      const bug = new Bug({
        title,
        description,
        reportedBy: reportedByStaff._id,
        assignedTo: assignedToStaff._id,
        severity,
        project,
      });

      await bug.save();
      res.status(201).json({ message: 'Bug created successfully', bug });
    } catch (err) {
      console.error('Error creating bug:', err.message);
      res
        .status(400)
        .json({ message: 'Error creating bug', error: err.message });
    }
  }

  static async getBugs(req, res) {
    try {
      const bugs = await Bug.find()
        .populate('reportedBy', 'firstName lastName')
        .populate('assignedTo', 'firstName lastName');

      res.json(bugs);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error fetching bugs', error: err.message });
    }
  }

  static async getBugById(req, res) {
    const { id } = req.params.id;

    try {
      const bug = await Bug.findById(id)
        .populate('reportedBy')
        .populate('assignedTo');
      if (!bug) return res.status(404).json({ message: 'Bug not found' });

      res.json('bug', { bug });
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error fetching bug', error: err.message });
    }
  }

  static async updateBug(req, res) {
    const { id } = req.params;
    const { title, description, reportedBy, assignedTo, severity, status } =
      req.body;

    try {
      const bug = await Bug.findByIdAndUpdate(
        id,
        {
          title,
          description,
          reportedBy, // Directly use the ID
          assignedTo, // Directly use the ID
          severity,
          status,
        },
        { new: true }
      );
      res.json(bug);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error updating bug', error: err.message });
    }
  }

  static async deleteBug(req, res) {
    try {
      await Bug.findByIdAndDelete(req.params.id);
      res.redirect('/bug-page');
    } catch (err) {
      console.log(err);
      res.status(500).send('server Error ');
    }
  }

  static async renderBugPage(req, res) {
    return res.render('bug');
  }

  static async getStaff(req, res) {
    try {
      const staffMembers = await Staff.find();
      res.json(staffMembers);
    } catch (err) {
      res
        .status(500)
        .json({ message: 'Error fetching staff members', error: err.message });
    }
  }
}

module.exports = BugController;
