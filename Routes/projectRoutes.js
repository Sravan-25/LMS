const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/projectConrollers');

router.get('/project-page', projectController.renderCreateTaskPage);
router.post('/create-task', projectController.createTask);
router.get('/all-tasks', projectController.getAllTasks);
router.get('/edit-task/:id', projectController.renderEditTaskPage);
router.post('/update-task/:id', projectController.updateTask);
router.get('/delete-task/:id', projectController.deleteTask);

module.exports = router;
