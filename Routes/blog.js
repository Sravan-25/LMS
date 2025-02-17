const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const blogController = require('../Controllers/blogsController');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'blog/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
router.post(
  '/blogs/edit/:id',
  upload.single('image'),
  blogController.updateBlog
);

// Routes
router.get('/blogs/new', blogController.showCreateBlogForm);
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id', blogController.getBlog);
router.post('/blogs', upload.single('image'), blogController.createBlog);
router.get('/blogs/edit/:id', blogController.showEditBlogForm);
router.get('/blogs/delete/:id', blogController.deleteBlog);

module.exports = router;
