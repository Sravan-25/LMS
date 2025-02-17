const { Router } = require('express');
const userController = require('../Controllers/userController');
const { checkForAuthCookie } = require('../middlewares/userAuth'); 
const router = Router();


router.get('/login', userController.renderSignin);
router.get('/register', userController.renderSignup);
router.get('/home', checkForAuthCookie, userController.renderHome); 
router.post('/signin', userController.handleSignin);
router.get('/logout', userController.handleLogout);
router.post('/signup', userController.handleSignup);
router.get('/profile', checkForAuthCookie, userController.renderProfile);
router.get('/edit-profile', checkForAuthCookie, userController.editProfile);
router.post('/save-profile', checkForAuthCookie, userController.saveProfile);
module.exports = router;
