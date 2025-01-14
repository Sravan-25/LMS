const Staff = require('../models/staffData');
const Bug = require('../models/bugSchema');
const Project = require('../models/projectmodel');

exports.renderBugPage = async (req, res) => {
  try {
    const staff = await Staff.find({}).lean();
    const project = await Project.find({}).lean();
    const bugs = await Bug.find({})
      .populate('reportedBy', 'firstName lastName')
      .populate('assignedTo', 'firstName lastName')
      .populate('project', 'name')
      .lean();

    let bug = null;

    if (req.params.id) {
      bug = await Bug.findById(req.params.id).lean();
      if (!bug) {
        return res.status(404).send('Bug not found');
      }
    }

    res.render('bug', { staff, project, bugs, bug });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Server Error');
  }
};

exports.createBugData = async (req, res) => {
  try {
    const {
      title,
      description,
      reportedBy,
      assignedTo,
      status,
      severity,
      project,
    } = req.body;

    const reportedByStaff = await Staff.findById(reportedBy);
    const assignedToStaff = await Staff.findById(assignedTo);

    if (!reportedByStaff || !assignedToStaff) {
      return res.status(400).json({
        message: 'Error: Invalid staff members.',
      });
    }

    const projectData = await Project.findById(project);
    if (!projectData) {
      return res.status(400).json({
        message: 'Error: Invalid project.',
      });
    }

    const bugData = new Bug({
      title,
      description,
      reportedBy: reportedByStaff._id,
      assignedTo: assignedToStaff._id,
      status,
      severity,
      project: projectData._id,
    });
    await bugData.save();

    res.redirect('/Bug-Page');
  } catch (error) {
    console.error('Error creating Bug:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBugs = async (req, res) => {
  try {
    const bugs = await Bug.find({})
      .populate('reportedBy', 'firstName lastName')
      .populate('assignedTo', 'firstName lastName')
      .populate('project', 'name')
      .lean();

    res.render('bug', { bugs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.deleteBug = async (req, res) => {
  try {
    const bugs = await Bug.findByIdAndDelete(req.params.id);
    res.redirect('/Bug-Page');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updateBug = async (req, res) => {
  try {
    const {
      title,
      description,
      reportedBy,
      assignedTo,
      status,
      severity,
      project,
    } = req.body;

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).send('Bug not found');
    }

    const reportedByStaff = await Staff.findById(reportedBy);
    const assignedToStaff = await Staff.findById(assignedTo);
    const projectData = await Project.findById(project);

    if (!reportedByStaff || !assignedToStaff) {
      return res.status(400).json({
        message: 'Error: Invalid staff members.',
      });
    }

    if (!projectData) {
      return res.status(400).json({
        message: 'Error: Invalid project.',
      });
    }

    bug.title = title;
    bug.description = description;
    bug.reportedBy = reportedByStaff._id;
    bug.assignedTo = assignedToStaff._id;
    bug.status = status;
    bug.severity = severity;
    bug.project = projectData._id;

    // Save the updated bug
    await bug.save();

    // Redirect back to the Bug Page
    res.redirect('/Bug-Page');
  } catch (err) {
    console.error('Error updating bug:', err);
    res.status(500).send('Server Error');
  }
};

exports.renderEditBugPage = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('reportedBy', 'firstName lastName')
      .populate('assignedTo', 'firstName lastName')
      .populate('project', 'name')
      .lean();
    if (!bug) {
      return res.status(404).send('Bug not found');
    }
    const staff = await Staff.find({}).lean();
    const projects = await Project.find({}).lean();
    res.render('edit-bug', { bug, staff, projects }); // This renders the form to edit the bug
  } catch (err) {
    console.error('Error fetching bug for edit:', err);
    res.status(500).send('Server Error');
  }
};
