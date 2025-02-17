const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const Blog = require('./models/blog');
const staff = require('./models/staffData');

const schoolsrouter = require('./Routes/schoolRouters');
const staffrouter = require('./Routes/staffRoutes');
const userrouter = require('./Routes/userRoutes');
const blogRoute = require('./Routes/blog');
const bugRoute = require('./Routes/bugRoutes');
const projectRoute = require('./Routes/projectRoutes');
const projectModelRouter = require('./Routes/projectModelRoutes');
const documentRouter = require('./Routes/documentRouter');
const {authenticateUser} = require("./middlewares/auth");

const app = express();
const PORT = 5022;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created.');
}

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/lms')
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Middleware for static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve staffData folder (outside public)
app.use('/staffData', express.static(path.join(__dirname, 'staffData')));

// Serve blog static files
app.use('/blog', express.static(path.join(__dirname, 'blog')));

app.use('/documents', express.static(path.join(__dirname, 'documents')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Set view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

app.get('/', (req, res) => res.redirect('/signin'));

// Render sign-in page
app.get('/signin', (req, res) => {
  res.render('signin');
});

// Render blogs page
app.get('/blogs', async (req, res) => {
  const blogs = await Blog.find({});
  res.render('blogsHome', { blogs });
});

app.get('/home', authenticateUser, (req, res) => {
  res.render('home', { user: req.user });
});

app.get("/ai", (req, res) => {
  res.render("Ai_Coplit")
})

// Static path for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(userrouter);
app.use(schoolsrouter);
app.use(staffrouter);
app.use(blogRoute);
app.use(bugRoute);
app.use('/', projectRoute);
app.use(projectModelRouter);
app.use(documentRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
