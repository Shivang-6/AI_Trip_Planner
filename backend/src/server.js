
//"llama-3.3-70b-versatile"

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateItinerary } = require('./services/groqService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
    res.status(200).json({ itinerary });
    
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ 
      error: 'Failed to generate itinerary',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});