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
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error("Groq API returned invalid JSON. Raw content:", content);
      throw new Error("Groq API returned invalid JSON. See server logs for details.");
    }
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
  If you cannot fill a field, use an empty array or string, but NEVER omit required fields. The response MUST be valid JSON.
  If you cannot fit all options, provide fewer, but NEVER omit required fields. The response MUST be valid JSON.
  Keep all descriptions and notes to 1-2 short sentences.

  User Input:
  - Destination: ${userInput.destination}
  - Travel Dates: ${userInput.startDate} to ${userInput.endDate} (${userInput.tripDays} days)
  - Travelers: ${userInput.adults} adults, ${userInput.children} children
  - Budget: ${userInput.budget}
  - Budget per Person: ${userInput.currency} ${userInput.budgetPerPerson}
  - Currency: ${userInput.currency}
  - Interests: ${userInput.interests.join(', ')}
  - Food Preferences: ${userInput.foodPreferences}
  - Accommodation Preference: ${userInput.accommodation}
  - Transportation Preference: ${userInput.transportation}
  - Trip Type: ${userInput.tripType}
  - Preferred Stay Location: ${userInput.preferredStayLocation}
  - Special Requests: ${userInput.specialRequests}

  IMPORTANT:
  - All cost estimates (overall budget, activities, food, etc.) must be in ${userInput.currency}.
  - ${userInput.currency === 'INR' ? 'Use realistic local prices for India.' : `Use realistic local prices for India, but convert all costs to ${userInput.currency} using a recent, reasonable exchange rate. Clearly mention the conversion rate used in the budget notes.`}
  - Prefer Indian brands, restaurants, and local travel tips where possible.
  - For every location (activity, restaurant, sight, accommodation), you MUST provide:
    - a valid Google Maps search URL (Format: "https://www.google.com/maps/search/?api=1&query=NAME,CITY". Replace spaces in the name with '+').
    - a relevant, high-quality imageUrl (preferably from Google Maps, Unsplash, or the official website; must be a direct image link, not a webpage).
  - For every accommodation, you MUST also provide a valid official website or major booking link (e.g., Booking.com, MakeMyTrip, Agoda, etc.) as 'bookingUrl'.
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
        "weather": {
          "temperature": "e.g., 28°C",
          "condition": "e.g., Sunny",
          "icon": "e.g., https://openweathermap.org/img/wn/01d.png"
        },
        "accommodationOptions": [
          {
            "name": "Hotel/Stay Name",
            "description": "Short description and why it's recommended (e.g., 'Centrally located, family-friendly, great reviews.').",
            "imageUrl": "https://images.unsplash.com/photo-...",
            "estimatedCost": "e.g., ₹3,000 - ₹5,000 per night",
            "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Hotel+Name,Jaipur",
            "bookingUrl": "https://www.booking.com/hotel/in/example.html"
          }
        ],
        "activityOptions": [
          [
            { 
              "description": "Option 1 for activity slot 1.",
              "details": "Practical info and why it's recommended.",
              "imageUrl": "https://images.unsplash.com/photo-...",
              "estimatedCost": "e.g., ₹500 per person",
              "transportationNote": "e.g., 'Take a local auto-rickshaw (approx. ₹200) or use a ride-sharing app.'",
              "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Amber+Fort,Jaipur"
            },
            { /* Option 2 for activity slot 1 */ },
            { /* Option 3 for activity slot 1 */ }
          ],
          [
            { /* Option 1 for activity slot 2 */ },
            { /* Option 2 for activity slot 2 */ }
          ]
        ],
        "foodSuggestions": {
          "breakfastOptions": [
            {
              "name": "Breakfast Place Name",
              "cuisine": "e.g., South Indian, Continental",
              "notes": "Why it's recommended.",
              "imageUrl": "https://images.unsplash.com/photo-...",
              "estimatedCost": "e.g., ₹200 - ₹400 per person",
              "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Breakfast+Place,Jaipur",
              "bookingUrl": "https://www.zomato.com/jaipur/breakfast-place"
            }
          ],
          "lunchOptions": [
            {
              "name": "Restaurant Name",
              "cuisine": "e.g., Authentic Rajasthani",
              "notes": "Why it's recommended.",
              "imageUrl": "https://images.unsplash.com/photo-...",
              "estimatedCost": "e.g., ₹400 - ₹800 per person",
              "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Restaurant+Name,Jaipur",
              "bookingUrl": "https://www.zomato.com/jaipur/restaurant-name"
            }
          ],
          "dinnerOptions": [
            {
              "name": "Another Restaurant",
              "cuisine": "e.g., Rooftop, Modern Indian",
              "notes": "e.g., 'Offers great views of the city. Reservation recommended for a good table.'",
              "imageUrl": "https://images.unsplash.com/photo-...",
              "estimatedCost": "e.g., ₹1000 - ₹2500 per person",
              "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Another+Restaurant,Jaipur",
              "bookingUrl": "https://www.zomato.com/jaipur/another-restaurant"
            }
          ]
        }
      }
    ],
    "generalTips": [
      "A useful, specific tip for the destination (e.g., 'Carry small change (₹10, ₹20, ₹50 notes) for street vendors and auto-rickshaws.'),",
      "Another practical tip (e.g., 'Bargaining is common in local markets, but always be respectful.')"
    ]
  }

  For each day, provide 2 unique accommodationOptions, 2 breakfastOptions, 2 lunchOptions, 2 dinnerOptions, and 2 options for each activity slot (as arrays of arrays in 'activityOptions'). Add a 'weather' field for each day. Ensure the number of day objects in the 'days' array matches the trip duration (${userInput.tripDays} days).
  Fill in all fields with creative, relevant, and genuinely helpful suggestions. Make it sound like it's from a seasoned Indian traveler who is also a professional planner.
  `;
}

module.exports = { generateItinerary };