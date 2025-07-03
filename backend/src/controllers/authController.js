const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

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

// Traditional Register
exports.register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, displayName });
    await user.save();
    req.login(user, err => {
      if (err) return res.status(500).json({ error: 'Login after register failed.' });
      res.json({ user });
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed.' });
  }
};

// Traditional Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    req.login(user, err => {
      if (err) return res.status(500).json({ error: 'Login failed.' });
      res.json({ user });
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

// Save itinerary to user profile
exports.saveItinerary = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const user = await User.findById(req.user._id);
    user.itineraries.push(req.body.itinerary);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save itinerary' });
  }
};

// Get all saved itineraries for user
exports.getItineraries = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const user = await User.findById(req.user._id);
    res.json({ itineraries: user.itineraries || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
}; 