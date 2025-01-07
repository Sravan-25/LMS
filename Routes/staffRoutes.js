const express = require('express');
const router = express.Router();
const staffController = require('../Controllers/staffControllers');

router.get('/staff-info', (req, res) => {
  res.render('staff');
});

router.post(
  '/staff',
  staffController.upload.single('image'),
  staffController.addStaff
);

router.get('/staff', staffController.renderStaffPage);


router.get('/');

module.exports = router;
