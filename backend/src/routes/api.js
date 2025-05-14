// routes/api.js
const express = require('express');
const router = express.Router();

router.post('/itinerary', async (req, res) => {
  const userInput = req.body;

  // You could use OpenAI or mock response here
  const itinerary = `Day 1: 9:00 AM - Arrival at ${userInput.destination}
12:00 PM - Lunch at local restaurant
2:00 PM - City tour
...

Day 2: 10:00 AM - Visit museum
1:00 PM - Local market walk`;

  res.json({ itinerary });
});

module.exports = router;
