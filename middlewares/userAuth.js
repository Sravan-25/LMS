const { validateToken } = require('./auth');

const checkForAuthCookie = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }

  try {
    req.user = validateToken(token);
    next();
  } catch (error) {
    console.log(error.message);
    res.clearCookie('token');
    res.redirect('/login');
  }
};

module.exports = { checkForAuthCookie };
