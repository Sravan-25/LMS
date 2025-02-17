const User = require('../models/user');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

exports.renderSignin = (req, res) => {
  return res.render('signin');
};

exports.renderSignup = (req, res) => {
  return res.render('signup');
};

exports.renderHome = (req, res) => {
  if (!req.user) return res.redirect('/signin');
  res.render('home', { user: req.user });
};

exports.handleSignin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('signin', { error: 'Email and password are required' });
  }

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    return res.redirect('/home');
  } catch (error) {
    console.error(error);
    return res.render('signin', { error: 'Incorrect Email or Password' });
  }
};

exports.handleLogout = (req, res) => {
  res.clearCookie('token').redirect('/signin');
};

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

exports.editProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.render('edit-profile', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const upload = multer({ storage });

exports.saveProfile = async (req, res) => {
  const { role, skills, address, socialMedia } = req.body;
  const profileImage = req.file ? req.file.path : null;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.role = role;
    user.skills = skills;
    user.address = address;
    user.socialMedia = socialMedia;

    if (profileImage) {
      user.profileImage = profileImage;
    }

    await user.save();
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
