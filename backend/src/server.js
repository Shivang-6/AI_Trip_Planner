//"llama-3.3-70b-versatile"

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateItinerary } = require('./services/groqService');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true if using HTTPS
    sameSite: 'lax',
  },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      // If user exists, return user
      return done(null, user);
    } else {
      // If new user, create and save to database
      const newUser = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
      });
      await newUser.save();
      return done(null, newUser);
    }
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Itinerary generation endpoint
app.post('/api/itinerary', async (req, res) => {
  try {
    // Validate required fields
    const { destination, startDate, endDate, tripDays } = req.body;
    
    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate the itinerary using Groq
    const itinerary = await generateItinerary(req.body);
    
    // Send the generated itinerary back to the client
    res.status(200).json(itinerary);
    
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ 
      error: 'Failed to generate itinerary',
      details: error.message 
    });
  }
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});