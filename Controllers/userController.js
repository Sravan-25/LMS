const User = require('../models/user');
const multer = require('multer');

// Set up Multer storage options for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/'); // Set the upload folder to 'public'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
  },
});

// Render Signin page
exports.renderSignin = (req, res) => {
  return res.render('signin');
};

// Render Signup page
exports.renderSignup = (req, res) => {
  return res.render('signup');
};

// Home route (redirects to signin if not logged in)
exports.renderHome = (req, res) => {
  if (!req.user) return res.redirect('/signin');
  res.render('home', { user: req.user });
};

// Handle Signin (authenticates and redirects with token)
exports.handleSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie('token', token).redirect('/home');
  } catch (error) {
    console.error(error); // Log any errors for debugging
    return res.render('signin', {
      error: 'Incorrect Email or Password',
    });
  }
};

// Handle Logout (clears cookie and redirects to signin)
exports.handleLogout = (req, res) => {
  res.clearCookie('token').redirect('/signin');
};

// Handle Signup (registers new user and redirects to signin)
exports.handleSignup = async (req, res) => {
  const { name, email, password, skills, role, profilePicture } = req.body;
  await User.create({
    name,
    email,
    password,
    skills,
    role,
    profilePicture,
  });
  return res.redirect('/signin');
};

// Render Profile page (user's profile)
exports.renderProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect('/signin');
    }

    const user = await User.findById(req.user._id);
    return res.render('profile', {
      user: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};

// Render profile of another user (by their ID, no blogs)
exports.editProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.render('edit-profile', { user }); // Render editable profile page
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Save Profile

const upload = multer({ storage });

// Controller for saving profile data
exports.saveProfile = async (req, res) => {
  const { role, skills, address, socialMedia } = req.body;
  const profileImage = req.file ? req.file.path : null; // Handle profile image upload

  try {
    // Find the user and update their profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update the user data with the form fields
    user.role = role;
    user.skills = skills;
    user.address = address;
    user.socialMedia = socialMedia;

    // Optionally update profile image if provided
    if (profileImage) {
      user.profileImage = profileImage;
    }

    // Save the updated user data
    await user.save();
    res.redirect('/profile'); // Redirect back to profile page after saving
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
