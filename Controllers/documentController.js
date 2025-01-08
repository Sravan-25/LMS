const multer = require('multer');
const path = require('path');
const Document = require('../models/documentSchema');
const Staff = require('../models/staffData');
const Project = require('../models/projectmodel');

exports.renderDocumentPage = async (req, res) => {
  try {
    const staffList = await Staff.find({}).lean();
    const projectList = await Project.find({}).lean();

    res.render('document', { staffList, projectList });
  } catch (err) {
    console.error('Error fetching data:', err);
    if (!res.headersSent) {
      res.status(500).send('Server Error');
    }
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, Excel, and Word files are allowed'), false);
  }
};

exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: { fileSize: 5 * 1024 * 1024 },
});

exports.uploadDocument = async (req, res) => {
  try {
    const { title, description, uploadedBy, project } = req.body;
    const fileUrl = req.file ? req.file.path : '';

    const staff = await Staff.findById(uploadedBy);
    const projectData = await Project.findById(project);

    if (!staff || !projectData) {
      return res.status(400).json({ error: 'Invalid staff or project ID' });
    }

    const newDocument = new Document({
      title,
      description,
      fileUrl,
      uploadedBy: staff._id,
      project: projectData._id,
    });

    const savedDocument = await newDocument.save();
    res.redirect("/document-page");
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: error.message });
  }
};
