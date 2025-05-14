// src/services/groqService.js
const Groq = require("groq-sdk");
const groq = new Groq(process.env.GROQ_API_KEY);

async function generateItinerary(userInput) {
  const prompt = buildPrompt(userInput);
  
  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return response.choices[0]?.message?.content || "Unable to generate itinerary";
  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
  }
}

function buildPrompt(userInput) {
  return `
  Create a detailed travel itinerary based on the following information:
  
  Destination: ${userInput.destination}
  Travel Dates: ${userInput.startDate} to ${userInput.endDate}
  Travelers: ${userInput.adults} adults, ${userInput.children} children
  Budget: ${userInput.budget}
  Interests: ${userInput.interests.join(', ')}
  Food Preferences: ${userInput.foodPreferences}
  
  The itinerary should include:
  - Daily schedule with time allocations
  - Recommended activities based on interests
  - Restaurant suggestions matching food preferences
  - Transportation options between locations
  - Budget-friendly alternatives where applicable
  
  Format the response in clear sections for each day with time slots.
  `;
}

module.exports = { generateItinerary };