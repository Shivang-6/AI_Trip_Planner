import React from 'react';

const LoadingItinerary = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
    <div className="flex flex-col items-center">
      <div className="mb-8">
        <svg className="animate-spin h-16 w-16 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-blue-700 mb-2">Generating your personalized itinerary…</h2>
      <p className="text-lg text-gray-600">Sit tight while we craft your perfect trip!</p>
    </div>
  </div>
);

export default LoadingItinerary; 