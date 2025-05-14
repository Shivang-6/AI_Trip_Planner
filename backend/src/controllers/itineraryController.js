// src/controllers/itineraryController.js
const { generateItinerary } = require('../services/groqService');

async function createItinerary(req, res) {
  try {
    const userInput = req.body;
    const itinerary = await generateItinerary(userInput);
    res.json({ itinerary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createItinerary };