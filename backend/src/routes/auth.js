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

module.exports = router; 