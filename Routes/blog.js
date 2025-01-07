const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const blogController = require('../Controllers/blogsController');

// storage setup
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
// create new blog
router.get('/blogs/new', blogController.showCreateBlogForm);

// Show all blogs
router.get('/blogs', blogController.getAllBlogs);

// Show blog by ID
router.get('/blogs/:id', blogController.getBlog);

// Create a new blog
router.post('/blogs', upload.single('image'), blogController.createBlog); 

// Show form to edit an existing blog
router.get('/blogs/edit/:id', blogController.showEditBlogForm);

// Delete a blog
router.get('/blogs/delete/:id', blogController.deleteBlog);

module.exports = router;
