const passport = require('passport');

// Initiate Google OAuth login
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
});

// Handle Google OAuth callback
exports.googleCallback = passport.authenticate('google', {
  failureRedirect: '/login',
  session: true
});

// Logout
exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};

// Get current user
exports.getCurrentUser = (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
}; 