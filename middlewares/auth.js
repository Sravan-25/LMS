const JWT = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || '$ravan@123';

// Create token for user with expiration time
function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profilePicture: user.profileImageURL,
    role: user.role,
    skills: user.skills,
  };

  return JWT.sign(payload, secret, { expiresIn: '24h' });
}

// Validate Token
function validateToken(token) {
  try {
    return JWT.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired. Please log in again.');
    }
    throw new Error('Invalid token. Please log in.');
  }
}

// Restrict the user to go to any other users before login
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.redirect('/signin');
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET || '$ravan@123');
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.redirect('/signin');
  }
};

module.exports = {
  createTokenForUser,
  validateToken,
  authenticateUser,
};
