const { validateToken } = require('./auth'); // Assuming auth.js is in utils

const checkForAuthCookie = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = validateToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message); // Log the exact reason
    res.clearCookie('token'); // Clear expired/invalid token
    res.redirect('/login'); // Redirect to login
  }
};
module.exports = { checkForAuthCookie };
