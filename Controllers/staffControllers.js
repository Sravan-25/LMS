const Staff = require('../models/staffData');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const staffDataDir = path.join(__dirname, '../staffData');
if (!fs.existsSync(staffDataDir)) {
  fs.mkdirSync(staffDataDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, staffDataDir);  
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`); 
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

exports.addStaff = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      position,
      department,
      dateOfJoining,
      salary,
      address,
      emergencyContact,
      status,
      about,
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;
    console.log('Uploaded Image:', imagePath); 

    const details = new Staff({
      image: imagePath,  
      firstName,
      lastName,
      email,
      phoneNumber,
      position,
      department,
      dateOfJoining,
      salary,
      address,
      emergencyContact,
      status,
      about,
    });

    await details.save();
    res.redirect('/staff');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding staff. Please try again.');
  }
};

exports.renderStaffPage = async (req, res) => {
  try {
    const staffMembers = await Staff.find(); 
    res.render('staff-data', { staff: staffMembers });  
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.upload = upload;
