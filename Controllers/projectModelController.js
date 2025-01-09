const Project = require('../models/projectmodel');
const Staff = require('../models/staffData');
const Task = require('../models/projectSchema');
const mongoose = require('mongoose');

exports.renderProjectPage = async (req, res) => {
  try {
    const staffList = await Staff.find({});
    const taskList = await Task.find({});
    const projects = await Project.find({})
      .populate('createdBy', 'firstName lastName')
      .populate('members', 'firstName lastName')
      .populate('tasks', 'title')
      .lean();

    res.render('project-model', { staffList, taskList, projects });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Server Error');
  }
};

exports.createProjectSchema = async (req, res) => {
  try {
    const {
      name,
      description,
      createdBy,
      members,
      tasks,
      startDate,
      endDate,
      status,
    } = req.body;

    const memberIds = members
      .split(',')
      .map((id) => new mongoose.Types.ObjectId(id));
    const taskIds = tasks
      .split(',')
      .map((id) => new mongoose.Types.ObjectId(id));

    const createdByStaff = await Staff.findById(createdBy);
    const membersByStaff = await Staff.find({ _id: { $in: memberIds } });
    const tasksAssigning = await Task.find({ _id: { $in: taskIds } }); 

    if (!createdByStaff) {
      return res.status(400).json({
        message: 'Error: Assigned To staff member not found.',
      });
    }

    if (membersByStaff.length === 0) {
      return res.status(400).json({
        message: 'Error: One or more members not found.',
      });
    }

    if (tasksAssigning.length === 0) {
      return res.status(400).json({
        message: 'Error: Tasks not found.',
      });
    }

    const newProject = new Project({
      name,
      description,
      createdBy: createdByStaff._id,
      members: membersByStaff.map((member) => member._id),
      tasks: tasksAssigning.map((task) => task._id), 
      startDate,
      endDate,
      status,
    });

    await newProject.save();
    res.redirect('/project-model');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'firstName lastName')
      .populate('members', 'firstName lastName')
      .populate('tasks', 'title')
      .lean();

    res.render('project-model', { projects });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updateProject = async (req, res) => {
  try {
    const {
      name,
      description,
      createdBy,
      members,
      tasks,
      startDate,
      endDate,
      status,
    } = req.body;

    const project = await Project.findByIdAndUpdate(req.params.id);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    const createdByStaff = await Staff.findById(createdBy);
    const membersByStaff = await Staff.find({ _id: { $in: members } });
    const tasksAssigning = await Task.find({ _id: { $in: tasks } });

    if (!createdByStaff) {
      return res.status(400).json({
        message: 'Error: Assigned To staff member not found.',
      });
    }

    if (membersByStaff.length === 0) {
      return res.status(400).json({
        message: 'Error: One or more members not found.',
      });
    }

    if (tasksAssigning.length === 0) {
      return res.status(400).json({
        message: 'Error: Tasks not found.',
      });
    }

    project.name = name;
    project.description = description;
    project.createdBy = createdByStaff._id;
    project.members = membersByStaff.map((member) => member._id);
    project.tasks = tasksAssigning.map((task) => task._id);
    project.startDate = startDate;
    project.endDate = endDate;
    project.status = status;

    await project.save();

    res.redirect('/project-model');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.renderEditProjectPage = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId)
      .populate('createdBy')
      .populate('members')
      .populate('tasks');

    const staffList = await Staff.find();
    const taskList = await Task.find();

    res.render('edit-project', {
      project,
      staffList,
      taskList,
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Server Error');
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    await Project.findByIdAndDelete(projectId);

    res.redirect('/project-model');
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send('Server Error');
  }
};