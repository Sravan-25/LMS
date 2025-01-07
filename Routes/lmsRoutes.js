// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const lmsController = require('../Controllers/lmsController');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
// });

// const upload = multer({ storage });

// router.post('/submit', upload.single('file'), lmsController.createLms);

// router.get('/home', (req, res) => {
//   res.render('Success');
// });

// router.get('/files', lmsController.renderFiles);

// router.get('/view/:id', lmsController.viewFile);

// router.get('/delete/:id', lmsController.deleteFiles);

// router.get('/back/home', (req, res) => {
//   if (req.user) {
//     return res.redirect('/');
//   }
//   return res.render('home');
// });

// module.exports = router;
