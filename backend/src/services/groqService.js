// src/services/groqService.js
const Groq = require("groq-sdk");
const groq = new Groq(process.env.GROQ_API_KEY);

async function generateItinerary(userInput) {
  const prompt = buildPrompt(userInput);
  
  try {
    const response = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a world-class digital concierge and expert travel planner. Your goal is to create a detailed, realistic, and inspiring travel plan based on user preferences. You must respond with a single, valid JSON object and nothing else. Ensure your suggestions are practical, creative, and provide real-world context." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" }
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Groq API returned an empty response.");
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Groq API error:", error);
    // Re-throwing the error to be caught by the controller
    throw new Error(`Failed to generate itinerary from Groq API. Details: ${error.message}`);
  }
}

function buildPrompt(userInput) {
  // We guide the model to produce a specific JSON structure with more detailed fields.
  return `
  Please create a highly detailed, realistic, and optimized travel itinerary based on the user's request.
  The output MUST be a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON.

  User Input:
  - Destination: ${userInput.destination}
  - Travel Dates: ${userInput.startDate} to ${userInput.endDate} (${userInput.tripDays} days)
  - Travelers: ${userInput.adults} adults, ${userInput.children} children
  - Budget: ${userInput.budget}
  - Budget per Person: ₹${userInput.budgetPerPerson}
  - Interests: ${userInput.interests.join(', ')}
  - Food Preferences: ${userInput.foodPreferences}
  - Accommodation Preference: ${userInput.accommodation}
  - Transportation Preference: ${userInput.transportation}

  IMPORTANT:
  - All cost estimates (overall budget, activities, food, etc.) must be in Indian Rupees (₹, INR), not USD.
  - Use realistic local prices for India.
  - Prefer Indian brands, restaurants, and local travel tips where possible.
  - For every location (activity, restaurant, sight), you MUST provide a valid Google Maps search URL. Format it like this: "https://www.google.com/maps/search/?api=1&query=NAME,CITY". Replace spaces in the name with '+'.
  - Do NOT include a time field for activities. Just list them in the order they should be done each day.

  Generate the itinerary in the following JSON format:

  {
    "destination": "${userInput.destination}",
    "tripSummary": "A vibrant and engaging summary of the trip, highlighting the key experiences based on user interests. Make it sound exciting.",
    "overallBudget": {
      "estimate": "e.g., ₹1,20,000 - ₹1,60,000 INR",
      "notes": "Brief notes on what this budget realistically covers (e.g., accommodation, food, activities) and what it might exclude (e.g., shopping, international flights)."
    },
    "days": [
      {
        "day": 1,
        "title": "A catchy and descriptive title for the day's theme (e.g., 'Arrival & Historic Heart').",
        "dailySummary": "A short summary of what the day entails, setting the tone and explaining the flow (e.g., 'Today is about settling in and exploring the historic old city, with a focus on architecture and local street food.').",
        "activities": [
          { 
            "description": "Clear and exciting description of the activity (e.g., 'Explore the Amber Fort').", 
            "details": "Practical information and tips. Explain WHY this fits the user's interests (e.g., 'A must-see for history lovers, offering stunning views and Rajput architecture.'). Mention booking recommendations if applicable.",
            "estimatedCost": "e.g., ₹500 per person",
            "transportationNote": "e.g., 'Take a local auto-rickshaw (approx. ₹200) or use a ride-sharing app.'",
            "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Amber+Fort,Jaipur"
          }
        ],
        "foodSuggestions": {
            "lunch": {
                "name": "Restaurant Name",
                "cuisine": "e.g., Authentic Rajasthani",
                "notes": "Why it's recommended (e.g., 'Known for its traditional thali. A perfect way to sample local flavors after visiting the fort.').",
                "estimatedCost": "e.g., ₹400 - ₹800 per person",
                "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Restaurant+Name,Jaipur"
            },
            "dinner": {
                "name": "Another Restaurant",
                "cuisine": "e.g., Rooftop, Modern Indian",
                "notes": "e.g., 'Offers great views of the city. Reservation recommended for a good table.'",
                "estimatedCost": "e.g., ₹1000 - ₹2500 per person",
                "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Another+Restaurant,Jaipur"
            }
        }
      }
    ],
    "generalTips": [
      "A useful, specific tip for the destination (e.g., 'Carry small change (₹10, ₹20, ₹50 notes) for street vendors and auto-rickshaws.').",
      "Another practical tip (e.g., 'Bargaining is common in local markets, but always be respectful.')."
    ]
  }

  Ensure the number of day objects in the 'days' array matches the trip duration (${userInput.tripDays} days).
  Fill in all fields with creative, relevant, and genuinely helpful suggestions. Make it sound like it's from a seasoned Indian traveler who is also a professional planner.
  `;
}

module.exports = { generateItinerary };