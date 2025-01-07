const express = require('express');
const router = express.Router();
const schoolsControllers = require('../Controllers/schoolsControllers');
const multer = require('multer');

// Multer setup
const upload = multer({ dest: 'uploads/' });

// Routes
router.get('/school-data', schoolsControllers.getSchools);
router.post(
  '/school-data',
  upload.single('file'),
  schoolsControllers.logSchools
);
router.get('/delete/:id', schoolsControllers.deleteSchool);
router.get('/view-file/:id', schoolsControllers.viewFile);

router.get('/back/home', (req, res) => {
  res.render('home');
});

router.get('/back/form', (req, res) => {
  res.render('School-Data');
});

router.get('/form-page', (req, res) => {
  res.render('School-Form');
});

router.get('/dashboard', schoolsControllers.dashboardGet);

module.exports = router;
