import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import Header from './components/Header';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

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
      
      // The response is now the itinerary object itself
      const processedItinerary = processItinerary(response, tripData);

      setItinerary(processedItinerary);
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
    // The service now returns the JSON object directly
    return await response.json();
  };

  const processItinerary = (itineraryData, tripData) => {
    // The data is already in a good format, we just add some client-side context
      return {
      ...itineraryData,
        duration: `${tripData.tripDays} days`,
        travelers: `${tripData.adults} adults, ${tripData.children} children`,
      budget: tripData.budget
    };
  };

  const ProtectedRoutes = () => {
    if (authLoading) {
      return <div>Loading...</div>; // Or a spinner
    }
    return user ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoutes />}>
          <Route element={ <> <Header user={user} /> <div className="planner-container"> <Outlet/> </div> </> }>
        <Route path="/planner" element={
              <>
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
              </>
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
        <Route path="/profile" element={<ProfilePage user={user} />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;