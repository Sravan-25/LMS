// const Lms = require('../models/lmsSchema');
// const fs = require('fs');
// const path = require('path');

// exports.createLms = async (req, res) => {
//   try {
//     const { fileName, about } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).send('File upload is required.');
//     }

//     const newUpload = new Lms({
//       fileName,
//       file: file.filename,
//       about,
//     });
//     await newUpload.save();

//     res.redirect('/home');
//   } catch (err) {
//     console.error('Error in createLms:', err.message);
//     res.status(500).send('Server Error');
//   }
// };

// exports.renderFiles = async (req, res) => {
//   try {
//     const files = await Lms.find();
//     res.render('files', { files });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Server Error');
//   }
// };

// exports.deleteFiles = async (req, res) => {
//   try {
//     await Lms.findByIdAndDelete(req.params.id);
//     res.redirect('/files');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// };

// exports.viewFile = async (req, res) => {
//   try {
//     const file = await Lms.findById(req.params.id);

//     if (!file) {
//       return res.status(404).send('File not found');
//     }
//     const filePath = path.join(__dirname, '../uploads', file.file);

//     res.sendFile(filePath);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// };

// exports.renderEditPage = async (req, res) => {
//   try {
//     const file = await Lms.findById(req.params.id);
//     if (!file) {
//       return res.status(404).send('File Not Found');
//     }
//     res.render('edit', { file });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server Error');
//   }
// };
