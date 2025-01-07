const Blog = require('../models/blog');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration (local storage for images)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './blog/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Show all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render('blogsHome', { blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Show a single blog
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    res.render('blogViews', { blog });
  } catch (err) {
    console.error(err);
    res.status(404).send('Blog not found');
  }
};

// form for creating new blog
exports.showCreateBlogForm = (req, res) => {
  res.render('addBlog');
};

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file ? req.file.filename : null;
    const newBlog = new Blog({ title, content, author, image });
    await newBlog.save();
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

//edit blog form
exports.showEditBlogForm = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render('editBlog', { blog });
  } catch (err) {
    console.error(err);
    res.status(404).send('Blog not found');
  }
};

//update blog
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    const image = req.file ? req.file.filename : blog.image;

    await Blog.findByIdAndUpdate(req.params.id, {
      title,
      content,
      author,
      image,
    });

    res.redirect(`/blogs/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

