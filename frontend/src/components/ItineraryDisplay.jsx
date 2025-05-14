// src/components/ItineraryDisplay.jsx
import React from 'react';
import '../styles/ItineraryDisplay.css';

const ItineraryDisplay = ({ itinerary, onRegenerate }) => {
  // Ensure days is always an array to avoid map() error
  const days = Array.isArray(itinerary.days) ? itinerary.days : [];
  return (
    <div className="itinerary-container">
      <div className="itinerary-header">
        <h2>Your Trip to {itinerary.destination}</h2>
        <p>{itinerary.duration} · {itinerary.travelers} · {itinerary.budget} budget</p>
      </div>

      <div className="itinerary-days">
        {days.map(day => (
          <div className="day-section" key={day.dayNumber}>
            <h3 className="day-title">Day {day.dayNumber}</h3>
            <ul className="activities-list">
              {Array.isArray(day.activities) && day.activities.map((activity, index) => (
                <li className="activity" key={index}>
                  {activity.time && <time>{activity.time}</time>}
                  <span>{activity.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="button-row">
        <button onClick={onRegenerate} className="regenerate-btn">
          Plan Another Trip
        </button>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
