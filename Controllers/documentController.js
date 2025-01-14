const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/documentSchema');
const Staff = require('../models/staffData');
const Project = require('../models/projectmodel');

exports.renderDocumentPage = async (req, res) => {
  try {
    const staffList = await Staff.find({}).lean();
    const projectList = await Project.find({});
    const documents = await Document.find({})
      .populate('uploadedBy', 'firstName lastName')
      .populate('project', 'name')
      .lean();

    const documentId = req.params.documentId;

    if (documentId) {
      const document = await Document.findById(documentId).lean();
      if (!document) {
        return res.status(404).send('Document Not Found');
      }
      return res.render('document', {
        staffList,
        projectList,
        documents,
        document,
        isEditing: true,
      });
    }

    res.render('document', {
      staffList,
      projectList,
      documents,
      isEditing: false,
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    if (!res.headersSent) {
      res.status(500).send('Server Error');
    }
  }
};

const storage = multer.diskStorage({
  destination: './documents/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
});

exports.uploadDocument = async (req, res) => {
  try {
    const { title, description, uploadedBy, project } = req.body;
    const fileName = req.file ? req.file.filename : '';

    const staff = await Staff.findById(uploadedBy);
    const projectData = await Project.findById(project);

    if (!staff) {
      return res.status(400).json({ error: 'Invalid staff' });
    }

    if (!projectData) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    const newDocument = new Document({
      title,
      description,
      fileUrl: `/documents/${fileName}`,
      uploadedBy: staff._id,
      project: projectData._id,
    });

    const savedDocument = await newDocument.save();
    res.redirect('/document-page');
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find({})
      .populate('uploadedBy', 'firstName lastName')
      .populate('project', 'name')
      .lean();
    res.render('document', { documents });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.viewDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).send('Document not found');
    }

    const fileUrl = document.fileUrl;

    if (!fileUrl) {
      return res.status(404).send('File URL not found');
    }

    const filePath = path.join(
      __dirname,
      '..',
      'documents',
      fileUrl.split('/').pop()
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error serving file:', err);
        return res.status(404).send('File not found.');
      }
    });
  } catch (error) {
    console.error('Error retrieving document:', error);
    res.status(500).send('Server error');
  }
};

exports.deleteDocs = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await Document.findByIdAndDelete(documentId);

    if (!document) {
      return res.status(404).send('Document not found');
    }

    // Optionally delete the file from the file system
    const filePath = path.join(
      __dirname,
      '../documents',
      path.basename(document.fileUrl)
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.redirect('/document-page');
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).send('Server Error');
  }
};

exports.updateOrCreateDocument = async (req, res) => {
  const { title, description, uploadedBy, project } = req.body;
  const documentId = req.params.documentId;
  const fileName = req.file ? req.file.filename : '';

  try {
    let document;
    if (documentId) {
      document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).send('Document Not Found');
      }
    } else {
      document = new Document();
    }

    const uploadedStaff = await Staff.findById(uploadedBy);
    const projectData = await Project.findById(project);

    if (!uploadedStaff) {
      return res
        .status(400)
        .json({ message: 'Error: Assigned Staff not found.' });
    }

    if (!projectData) {
      return res
        .status(400)
        .json({ message: 'Error: Assigned Project not found.' });
    }

    document.title = title;
    document.description = description;
    document.uploadedBy = uploadedStaff._id;
    document.project = projectData._id;
    document.fileUrl = `/documents/${fileName}`;

    await document.save();

    res.redirect('/documents');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
