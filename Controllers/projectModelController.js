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

    if (!members || !tasks) {
      return res
        .status(400)
        .json({ message: 'Error: Members and tasks are required.' });
    }

    const memberIds = members.split(',').map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid member ID: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    const taskIds = tasks.split(',').map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid task ID: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    const createdByStaff = await Staff.findById(createdBy);
    const membersByStaff = await Staff.find({ _id: { $in: memberIds } });
    const tasksAssigning = await Task.find({ _id: { $in: taskIds } });

    if (!createdByStaff) {
      return res.status(400).json({
        message: 'Error: Assigned to staff member not found.',
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

    // Create a new project
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

    // Save the project
    await newProject.save();

    // Redirect or return a success response
    res.redirect('/project-model');
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Server Error: ${err.message}` });
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

    // Find the project to update
    const project = await Project.findByIdAndUpdate(req.params.id);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Validate and convert member IDs
    const memberIds = members
      .split(',')
      .map((id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid member ID: ${id}`);
        }
        return new mongoose.Types.ObjectId(id);
      });

    // Validate and convert task IDs
    const taskIds = tasks
      .split(',')
      .map((id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid task ID: ${id}`);
        }
        return new mongoose.Types.ObjectId(id);
      });

    // Fetch the related staff and tasks
    const createdByStaff = await Staff.findById(createdBy);
    const membersByStaff = await Staff.find({ _id: { $in: memberIds } });
    const tasksAssigning = await Task.find({ _id: { $in: taskIds } });

    // Handle errors if any staff or task is not found
    if (!createdByStaff) {
      return res.status(400).json({
        message: 'Error: Assigned to staff member not found.',
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

    // Update project with new values
    project.name = name;
    project.description = description;
    project.createdBy = createdByStaff._id;
    project.members = membersByStaff.map((member) => member._id);
    project.tasks = tasksAssigning.map((task) => task._id);
    project.startDate = startDate;
    project.endDate = endDate;
    project.status = status;

    // Save the updated project
    await project.save();

    // Redirect or return success response
    res.redirect('/project-model');
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: `Server Error: ${err.message}` });
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
