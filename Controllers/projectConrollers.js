const Task = require('../models/projectSchema');
const Staff = require('../models/staffData');

exports.renderCreateTaskPage = async (req, res) => {
  try {
    const staff = await Staff.find({});
    let task = null;
    const tasks = await Task.find({});

    if (req.params.id) {
      task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).send('Task not found');
      }
    }

    res.render('project', {
      title: task ? 'Edit Task' : 'Create New Task',
      staff,
      task,
      tasks,
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Server Error');
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate } = req.body;

    const assignedToStaff = await Staff.findById(assignedTo);

    if (!assignedToStaff) {
      return res.status(400).json({
        message: 'Error: Assigned To staff member not found.',
      });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo: assignedToStaff._id,
      status,
      dueDate,
    });

    await newTask.save();
    res.redirect('/project-page');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log(tasks);
    res.render('project', { tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    await Task.findByIdAndDelete(taskId);

    res.redirect('/project-page');
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send('Server Error');
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(req.params.id);

    if (!task) {
      return res.status(404).send('Task not found');
    }

    const assignedToStaff = await Staff.findById(assignedTo);

    if (!assignedToStaff) {
      return res.status(400).json({
        message: 'Error: Assigned To staff member not found.',
      });
    }

    task.title = title;
    task.description = description;
    task.assignedTo = assignedToStaff._id;
    task.status = status;
    task.priority = priority;
    task.dueDate = dueDate;

    await task.save();

    res.redirect('/project-page');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.renderEditTaskPage = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    const staff = await Staff.find({});

    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.render('edit-task', {
      title: 'Edit Task',
      task,
      staff,
      tasks: [],
    });
  } catch (err) {
    console.error('Error fetching task for edit:', err);
    res.status(500).send('Server Error');
  }
};
