import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import './styles/main.css';
import './styles/TripForm.css';       // in TripForm.jsx
import './styles/LandingPage.css';    // in LandingPage.jsx
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate dates first
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        throw new Error('End date must be after start date');
      }

      const tripData = {
        ...formData,
        tripDays: calculateTripDays(formData.startDate, formData.endDate)
      };

      const response = await fetchItinerary(tripData);
      const parsedItinerary = parseItinerary(response.itinerary, tripData);
      
      setItinerary(parsedItinerary);
      navigate('/results');
      
    } catch (err) {
      console.error('Itinerary generation error:', err);
      setError(err.message || 'Failed to generate itinerary');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTripDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const fetchItinerary = async (tripData) => {
    const response = await fetch('http://localhost:5000/api/itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Network response was not ok');
    }

    return await response.json();
  };

  const parseItinerary = (aiResponse, tripData) => {
    try {
      // Enhanced parsing logic
      const dayRegex = /Day (\d+):([\s\S]*?)(?=\nDay \d+:|$)/gi;
      const days = [];
      let match;

      while ((match = dayRegex.exec(aiResponse))) {
        const dayNumber = parseInt(match[1]);
        const dayContent = match[2].trim();
        
        const activities = dayContent.split('\n')
          .filter(line => line.trim())
          .map(line => {
            const timeMatch = line.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*-?\s*/i);
            const time = timeMatch ? timeMatch[1] : '';
            const description = line.replace(timeMatch?.[0] || '', '').trim();
            
            return { time, description };
          });

        days.push({ dayNumber, activities });
      }

      return {
        destination: tripData.destination,
        duration: `${tripData.tripDays} days`,
        travelers: `${tripData.adults} adults, ${tripData.children} children`,
        budget: tripData.budget,
        days: days.length ? days : createFallbackItinerary(aiResponse, tripData.tripDays),
        rawText: aiResponse
      };
    } catch (parseError) {
      console.error('Parsing error:', parseError);
      return createFallbackItinerary(aiResponse, tripData.tripDays);
    }
  };

  const createFallbackItinerary = (text, days) => {
    return {
      days: Array.from({ length: days }, (_, i) => ({
        dayNumber: i + 1,
        activities: [{
          time: '',
          description: text || 'Could not parse itinerary details'
        }]
      }))
    };
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/planner" element={
          <div className="planner-container">
            <h1>AI Trip Planner</h1>
            <TripForm onSubmit={handleSubmit} />
            
            {isLoading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <p>Creating your personalized itinerary...</p>
              </div>
            )}
            
            {error && (
              <div className="error-message">
                <p>⚠️ {error}</p>
                <button onClick={() => setError(null)}>Dismiss</button>
              </div>
            )}
          </div>
        } />
        
        <Route path="/results" element={
          itinerary ? (
            <ItineraryDisplay 
              itinerary={itinerary} 
              onRegenerate={() => navigate('/planner')}
            />
          ) : (
            <div className="empty-state">
              <h2>No Itinerary Found</h2>
              <p>Start by planning your trip</p>
              <button onClick={() => navigate('/planner')}>Plan New Trip</button>
            </div>
          )
        } />
        
      </Routes>
    </div>
  );
}

export default App;