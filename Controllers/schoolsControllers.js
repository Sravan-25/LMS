const multer = require('multer');
const path = require('path');
const Schools = require('../models/schoolsSchema');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Controller
exports.logSchools = async (req, res) => {
  try {
    const { schoolName, address, principalName, phoneNumber } = req.body;
    const file = req.file.filename;
    const details = new Schools({
      schoolName,
      address,
      principalName,
      phoneNumber,
      file,
    });
    await details.save();
    res.redirect('/school-data');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getSchools = async (req, res) => {
  try {
    const schools = await Schools.find();
    res.render('school-data', { schools });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    await Schools.findByIdAndDelete(id);
    res.redirect('/school-data');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.viewFile = async (req, res) => {
  try {
    const file = await Schools.findById(req.params.id);

    if (!file) {
      return res.status(404).send('File not found');
    }
    const filePath = path.join(__dirname, '../uploads', file.file);

    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } catch (err) {
    console.error('Error serving the file:', err);
    res.status(500).send('Server error');
  }
};

exports.dashboardGet = async (req, res) => {
  try {
    const schools = await Schools.find({});

    res.render('home', { schools });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching schools');
  }
};
