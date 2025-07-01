// src/components/ItineraryDisplay.jsx
import React from 'react';

const ItineraryDisplay = ({ itinerary, onRegenerate }) => {
  if (!itinerary) {
    return null; // Or a loading/error state
  }

  const {
    destination,
    duration,
    travelers,
    budget,
    tripSummary,
    days = [],
    overallBudget,
    generalTips
  } = itinerary;

  return (
    <div className="max-w-4xl mx-auto my-8 p-4 sm:p-8 bg-gray-50 rounded-xl shadow-lg font-sans">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-6 mb-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">Your Trip to {destination}</h2>
        <div className="flex justify-center items-center gap-6 text-gray-600 text-base mb-4">
          <span>{duration}</span>
          <span>{travelers}</span>
          <span className="bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full capitalize">{budget} Budget</span>
        </div>
        {tripSummary && <p className="text-lg text-gray-700 max-w-3xl mx-auto">{tripSummary}</p>}
      </div>

      {/* Budget & Tips */}
      {overallBudget && (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg mb-8">
          <h3 className="font-bold text-indigo-800">Budget Overview</h3>
          <p><strong>Estimate:</strong> {overallBudget.estimate}</p>
          <p className="italic text-sm">{overallBudget.notes}</p>
        </div>
      )}

      {/* Itinerary Days */}
      <div className="space-y-8">
        {days.map(day => (
          <div key={day.day} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-blue-900 mb-1">Day {day.day}: {day.title}</h3>
            {day.dailySummary && <p className="italic text-gray-500 mb-6">{day.dailySummary}</p>}
            
            {day.activities?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">Activities</h4>
                <ul className="space-y-4">
                  {day.activities.map((activity, index) => (
                    <li key={index} className="flex flex-col gap-1 border-b border-gray-100 pb-4 last:border-b-0">
                      <strong className="block font-medium text-gray-800">
                        {activity.googleMapsUrl ? (
                          <a href={activity.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-800">
                            {activity.description}
                          </a>
                        ) : (
                          activity.description
                        )}
                      </strong>
                      {activity.details && <p className="text-gray-600 text-sm mt-1">{activity.details}</p>}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-2">
                        {activity.estimatedCost && <span className="bg-gray-100 px-2 py-1 rounded">Cost: {activity.estimatedCost}</span>}
                        {activity.transportationNote && <span className="bg-gray-100 px-2 py-1 rounded">Transport: {activity.transportationNote}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {day.foodSuggestions && (
              <div className="mt-6">
                <h4 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2 mb-4">Dining Suggestions</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {day.foodSuggestions.lunch && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h5 className="font-bold text-gray-700">Lunch</h5>
                      <p>
                        <strong>
                          {day.foodSuggestions.lunch.googleMapsUrl ? (
                            <a href={day.foodSuggestions.lunch.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {day.foodSuggestions.lunch.name}
                            </a>
                          ) : (
                            day.foodSuggestions.lunch.name
                          )}
                        </strong> ({day.foodSuggestions.lunch.cuisine})
                      </p>
                      <p className="italic text-sm text-gray-600 my-1">{day.foodSuggestions.lunch.notes}</p>
                      {day.foodSuggestions.lunch.estimatedCost && <p className="font-semibold text-green-700 text-right text-sm">~{day.foodSuggestions.lunch.estimatedCost}</p>}
                    </div>
                  )}
                  {day.foodSuggestions.dinner && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h5 className="font-bold text-gray-700">Dinner</h5>
                      <p>
                        <strong>
                          {day.foodSuggestions.dinner.googleMapsUrl ? (
                            <a href={day.foodSuggestions.dinner.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {day.foodSuggestions.dinner.name}
                            </a>
                          ) : (
                            day.foodSuggestions.dinner.name
                          )}
                        </strong> ({day.foodSuggestions.dinner.cuisine})
                      </p>
                      <p className="italic text-sm text-gray-600 my-1">{day.foodSuggestions.dinner.notes}</p>
                      {day.foodSuggestions.dinner.estimatedCost && <p className="font-semibold text-green-700 text-right text-sm">~{day.foodSuggestions.dinner.estimatedCost}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {generalTips?.length > 0 && (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg mt-8">
          <h3 className="font-bold text-indigo-800">General Tips for Your Trip</h3>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            {generalTips.map((tip, index) => <li key={index}>{tip}</li>)}
          </ul>
        </div>
      )}

      {/* Button */}
      <div className="mt-10 text-center">
        <button onClick={onRegenerate} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 shadow-md">
          Plan Another Trip
        </button>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
