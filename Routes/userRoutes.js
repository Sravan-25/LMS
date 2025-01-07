const { Router } = require('express');
const userController = require('../Controllers/userController');
const { checkForAuthCookie } = require('../middlewares/userAuth'); // Import the middleware
const router = Router();

// Render Signin page
router.get('/login', userController.renderSignin);

// Render Signup page
router.get('/register', userController.renderSignup);

// Home route (protected by authentication)
router.get('/home', checkForAuthCookie, userController.renderHome); // Middleware applied here

// Handle Signin (authenticates and redirects with token)
router.post('/signin', userController.handleSignin);

// Handle Logout (clears cookie and redirects)
router.get('/logout', userController.handleLogout);

// Handle Signup (registers new user)
router.post('/signup', userController.handleSignup);

// Render Profile page (protected by authentication)
router.get('/profile', checkForAuthCookie, userController.renderProfile); // Middleware applied here

// Render profile of another user (protected by authentication)
router.get('/edit-profile', checkForAuthCookie, userController.editProfile);

// Route to save updated profile
router.post('/save-profile', checkForAuthCookie, userController.saveProfile);
module.exports = router;
