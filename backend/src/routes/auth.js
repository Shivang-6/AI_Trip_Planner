const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Google OAuth login
router.get('/google', authController.googleAuth);

// Google OAuth callback
router.get('/google/callback', authController.googleCallback, (req, res) => {
  // Redirect to frontend after successful login
  res.redirect('http://localhost:3000');
});

// Logout
router.get('/logout', authController.logout);

// Get current user
router.get('/me', authController.getCurrentUser);

// Traditional email/password auth
router.post('/register', authController.register);
router.post('/login', authController.login);

// Itinerary save/fetch (protected)
const ensureAuth = (req, res, next) => req.isAuthenticated() ? next() : res.status(401).json({ error: 'Not authenticated' });
router.post('/api/itineraries', ensureAuth, authController.saveItinerary);
router.get('/api/itineraries', ensureAuth, authController.getItineraries);

module.exports = router; 