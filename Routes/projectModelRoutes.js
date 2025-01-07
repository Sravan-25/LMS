const projectModelControllers = require('../Controllers/projectModelController');
const express = require('express');
const router = express.Router();

router.get('/project-model', projectModelControllers.renderProjectPage);
router.post('/project-create', projectModelControllers.createProjectSchema);
router.get('/all-projects', projectModelControllers.getAllProjects);
router.post('/update-project/:id', projectModelControllers.updateProject);
router.get('/edit-page/:id', projectModelControllers.renderEditProjectPage);
router.get("/delete-project/:id", projectModelControllers.deleteProject);

module.exports = router;
