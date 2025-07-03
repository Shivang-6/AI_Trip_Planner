// src/components/ItineraryDisplay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ItineraryDisplay = ({ itinerary, onRegenerate, user }) => {
  // Always call hooks first!
  const [selections, setSelections] = useState(() =>
    itinerary && itinerary.days ? itinerary.days.map(day => ({
      accommodation: null,
      activities: Array(day.activityOptions?.length || 0).fill(null),
      breakfast: null,
      lunch: null,
      dinner: null
    })) : []
  );
  const [finalized, setFinalized] = useState(false);
  const dayRefs = useRef([]);
  const [activeDay, setActiveDay] = useState(0);

  // Download as PDF, Print, etc. ...

  // Save itinerary when finalized
  useEffect(() => {
    if (finalized && user) {
      fetch('http://localhost:5000/auth/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itinerary })
      });
    }
    // eslint-disable-next-line
  }, [finalized, user]);

  // Track scroll position for active day highlight
  useEffect(() => {
    const handleScroll = () => {
      const offsets = dayRefs.current.map(ref => ref?.getBoundingClientRect().top || 9999);
      const active = offsets.findIndex(offset => offset > 80) - 1;
      setActiveDay(Math.max(0, active));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleSelect = (dayIdx, slot, optionIdx, activitySlotIdx) => {
    setSelections(prev => prev.map((sel, i) => {
      if (i !== dayIdx) return sel;
      if (slot === 'activities') {
        const newActs = [...sel.activities];
        newActs[activitySlotIdx] = optionIdx;
        return { ...sel, activities: newActs };
      }
      return { ...sel, [slot]: optionIdx };
    }));
  };

  const allSelected = selections.every((sel, i) => {
    const day = days[i];
    return (
      sel.accommodation !== null &&
      sel.breakfast !== null &&
      sel.lunch !== null &&
      sel.dinner !== null &&
      (day.activityOptions ? sel.activities.every(idx => idx !== null) : true)
    );
  });

  const handleFinalize = () => setFinalized(true);

  // Download as PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF('p', 'pt', 'a4');
    doc.setFontSize(22);
    doc.text(`Trip to ${destination}`, 40, 50);
    let y = 80;
    days.forEach((day, i) => {
      doc.setFontSize(16);
      doc.text(`Day ${day.day}: ${day.title}`, 40, y);
      y += 20;
      doc.setFontSize(12);
      doc.text(day.dailySummary || '', 40, y);
      y += 16;
      if (day.weather) {
        doc.text(`Weather: ${day.weather.temperature}, ${day.weather.condition}`, 40, y);
        y += 16;
      }
      // Accommodation
      if (day.accommodationOptions && selections[i].accommodation !== null) {
        const acc = day.accommodationOptions[selections[i].accommodation];
        doc.text(`Stay: ${acc.name} (${acc.estimatedCost})`, 40, y);
        y += 16;
      }
      // Activities
      if (day.activityOptions) {
        day.activityOptions.forEach((slot, slotIdx) => {
          const actIdx = selections[i].activities[slotIdx];
          if (actIdx !== null) {
            const act = slot[actIdx];
            doc.text(`Activity: ${act.description} (${act.estimatedCost})`, 40, y);
            y += 16;
          }
        });
      }
      // Food
      if (day.foodSuggestions) {
        if (day.foodSuggestions.breakfastOptions && selections[i].breakfast !== null) {
          const breakfast = day.foodSuggestions.breakfastOptions[selections[i].breakfast];
          doc.text(`Breakfast: ${breakfast.name} (${breakfast.estimatedCost})`, 40, y);
          y += 16;
        }
        if (day.foodSuggestions.lunchOptions && selections[i].lunch !== null) {
          const lunch = day.foodSuggestions.lunchOptions[selections[i].lunch];
          doc.text(`Lunch: ${lunch.name} (${lunch.estimatedCost})`, 40, y);
          y += 16;
        }
        if (day.foodSuggestions.dinnerOptions && selections[i].dinner !== null) {
          const dinner = day.foodSuggestions.dinnerOptions[selections[i].dinner];
          doc.text(`Dinner: ${dinner.name} (${dinner.estimatedCost})`, 40, y);
          y += 16;
        }
      }
      y += 10;
    });
    doc.save(`Trip_to_${destination.replace(/\s+/g, '_')}.pdf`);
  };

  // Print itinerary
  const handlePrint = () => {
    window.print();
  };

  // Fallback image
  const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

  // Scroll to day
  const scrollToDay = idx => {
    dayRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Helper to extract conversion rate from budget notes
  function extractConversionRate(notes) {
    if (!notes) return null;
    const match = notes.match(/conversion rate[^\d]*(\d+(?:\.\d+)?)/i);
    if (match) return match[1];
    // Try to match e.g. '1 USD = 83 INR' or similar
    const match2 = notes.match(/(\d+(?:\.\d+)?)\s*(INR|USD|EUR|GBP|AUD|CAD|JPY)?\s*=\s*(\d+(?:\.\d+)?)\s*(INR|USD|EUR|GBP|AUD|CAD|JPY)/i);
    if (match2) return `${match2[1]} ${match2[2] || ''} = ${match2[3]} ${match2[4] || ''}`;
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-0">
      {/* Day Navigation (not sticky) */}
      <nav className="bg-white/90 border-b border-gray-200 flex gap-2 px-4 py-2 overflow-x-auto shadow-sm">
        {days.map((day, idx) => (
          <button
            key={day.day}
            onClick={() => scrollToDay(idx)}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 text-base whitespace-nowrap
              ${activeDay === idx ? 'bg-blue-600 text-white shadow' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
          >
            Day {day.day}
          </button>
        ))}
      </nav>

      {/* Header (not sticky) */}
      <div className="w-full bg-white/80 border-b border-gray-200 py-10 px-4 sm:px-16 shadow-md">
        <h2 className="text-5xl sm:text-6xl font-extrabold text-blue-900 mb-2 tracking-tight drop-shadow">Your Trip to {destination}</h2>
        <div className="flex flex-wrap justify-center items-center gap-6 text-gray-700 text-lg mb-4">
          <span>{duration}</span>
          <span>{travelers}</span>
          <span className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full capitalize">{budget} Budget</span>
        </div>
        {tripSummary && <p className="text-xl text-gray-700 max-w-4xl mx-auto mt-2">{tripSummary}</p>}
      </div>

      {/* Budget & Tips */}
      {overallBudget && (
        <div className="w-full flex justify-center mt-8">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-xl shadow max-w-2xl w-full">
            <h3 className="font-bold text-indigo-800 text-lg mb-1">Budget Overview</h3>
            <p><strong>Estimate:</strong> <span className="text-blue-900 font-bold">{overallBudget.estimate}</span></p>
            {extractConversionRate(overallBudget.notes) && (
              <div className="text-sm text-blue-700 font-semibold mt-1">Conversion Rate Used: {extractConversionRate(overallBudget.notes)}</div>
            )}
            <p className="italic text-sm mt-2">{overallBudget.notes}</p>
          </div>
        </div>
      )}

      {/* Itinerary Days */}
      <div className="w-full flex flex-col gap-12 mt-12 px-2 sm:px-8 md:px-16">
        {days.map((day, dayIdx) => (
          <section
            key={day.day}
            ref={el => (dayRefs.current[dayIdx] = el)}
            className="w-full bg-white/90 rounded-3xl shadow-2xl border border-gray-200 p-0 overflow-hidden flex flex-col md:flex-row md:gap-0 gap-8 hover:shadow-3xl transition-all duration-300"
          >
            {/* Left: Day summary and weather */}
            <div className="md:w-1/3 p-8 flex flex-col justify-between bg-gradient-to-b from-blue-100 to-indigo-50 border-r border-gray-100">
              <div>
                <h3 className="text-3xl font-bold text-blue-900 mb-2">Day {day.day}: {day.title}</h3>
                {day.dailySummary && <p className="italic text-gray-500 mb-4">{day.dailySummary}</p>}
              </div>
              {day.weather && (
                <div className="flex items-center gap-4 mt-4">
                  {day.weather.icon && <img src={day.weather.icon} alt={day.weather.condition} className="h-12 w-12" />}
                  <span className="text-2xl font-semibold text-blue-700">{day.weather.temperature}</span>
                  <span className="text-gray-600 text-lg">{day.weather.condition}</span>
                </div>
              )}
            </div>
            {/* Right: All options */}
            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Accommodation Selection */}
              {day.accommodationOptions && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Where to Stay</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {day.accommodationOptions.map((opt, idx) => (
                      <div 
                        key={idx} 
                        className={`
                          relative p-4 rounded-2xl border-2 transition-all duration-300 ease-in-out cursor-pointer bg-white shadow-md
                          ${selections[dayIdx].accommodation === idx 
                            ? 'border-blue-500 shadow-xl scale-105' 
                            : 'border-gray-200 hover:shadow-lg hover:scale-[1.02]'
                          }
                        `}
                        onClick={() => !finalized && handleSelect(dayIdx, 'accommodation', idx)}
                      >
                        {selections[dayIdx].accommodation === idx && (
                          <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-lg z-10">
                              <FaCheck size="0.8em" />
                          </div>
                        )}
                        <div className="font-bold text-blue-800 text-lg mb-1">{opt.name}</div>
                        <div className="text-gray-600 text-sm mb-1">{opt.description}</div>
                        <div className="flex flex-wrap gap-2 text-xs mb-2">
                          <span className="bg-gray-100 px-2 py-1 rounded">{opt.estimatedCost}</span>
                          {opt.bookingUrl && <a href={opt.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Book</a>}
                          <a href={opt.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Map</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Activities Selection */}
              {day.activityOptions && day.activityOptions.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Things to Do</h4>
                  {day.activityOptions.map((slot, slotIdx) => (
                    <div key={slotIdx} className="mb-4">
                      <div className="font-medium text-gray-700 mb-1">Activity Slot {slotIdx + 1}</div>
                      <div className="grid grid-cols-1 gap-4">
                        {slot.map((opt, idx) => (
                          <div 
                            key={idx} 
                            className={`
                              relative p-4 rounded-2xl border-2 transition-all duration-300 ease-in-out cursor-pointer bg-white shadow-md
                              ${selections[dayIdx].activities[slotIdx] === idx 
                                ? 'border-blue-500 shadow-xl scale-105' 
                                : 'border-gray-200 hover:shadow-lg hover:scale-[1.02]'
                              }
                            `}
                            onClick={() => !finalized && handleSelect(dayIdx, 'activities', idx, slotIdx)}
                          >
                            {selections[dayIdx].activities[slotIdx] === idx && (
                              <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-lg z-10">
                                  <FaCheck size="0.8em" />
                              </div>
                            )}
                            <div className="font-bold text-blue-800 text-lg mb-1">
                              {opt.googleMapsUrl ? (
                                <a href={opt.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{opt.description}</a>
                              ) : opt.description}
                            </div>
                            <div className="text-gray-600 text-sm mb-1">{opt.details}</div>
                            <div className="flex flex-wrap gap-2 text-xs mb-2">
                              <span className="bg-gray-100 px-2 py-1 rounded">{opt.estimatedCost}</span>
                              {opt.transportationNote && <span className="bg-gray-100 px-2 py-1 rounded">{opt.transportationNote}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Food Selection */}
              {day.foodSuggestions && (
                <div className="col-span-2">
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">Dining Options</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Breakfast */}
                    <div>
                      <div className="font-bold text-gray-700 mb-1">Breakfast</div>
                      <div className="grid gap-2">
                        {day.foodSuggestions.breakfastOptions?.map((opt, idx) => (
                          <div 
                            key={idx} 
                            className={`
                              relative p-3 rounded-2xl border-2 transition-all duration-300 ease-in-out cursor-pointer bg-white shadow-md
                              ${selections[dayIdx].breakfast === idx 
                                ? 'border-blue-500 shadow-xl scale-105' 
                                : 'border-gray-200 hover:shadow-lg hover:scale-[1.02]'
                              }
                            `}
                            onClick={() => !finalized && handleSelect(dayIdx, 'breakfast', idx)}
                          >
                            {selections[dayIdx].breakfast === idx && (
                              <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-lg z-10">
                                  <FaCheck size="0.8em" />
                              </div>
                            )}
                            <div className="font-semibold text-blue-800">
                              {opt.googleMapsUrl ? (
                                <a href={opt.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{opt.name}</a>
                              ) : opt.name}
                            </div>
                            <div className="text-gray-600 text-xs">{opt.cuisine}</div>
                            <div className="text-gray-500 text-xs mb-1">{opt.notes}</div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="bg-gray-100 px-2 py-1 rounded">{opt.estimatedCost}</span>
                              {opt.bookingUrl && <a href={opt.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Book</a>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Lunch */}
                    <div>
                      <div className="font-bold text-gray-700 mb-1">Lunch</div>
                      <div className="grid gap-2">
                        {day.foodSuggestions.lunchOptions?.map((opt, idx) => (
                          <div 
                            key={idx} 
                            className={`
                              relative p-3 rounded-2xl border-2 transition-all duration-300 ease-in-out cursor-pointer bg-white shadow-md
                              ${selections[dayIdx].lunch === idx 
                                ? 'border-blue-500 shadow-xl scale-105' 
                                : 'border-gray-200 hover:shadow-lg hover:scale-[1.02]'
                              }
                            `}
                            onClick={() => !finalized && handleSelect(dayIdx, 'lunch', idx)}
                          >
                            {selections[dayIdx].lunch === idx && (
                              <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-lg z-10">
                                  <FaCheck size="0.8em" />
                              </div>
                            )}
                            <div className="font-semibold text-blue-800">
                              {opt.googleMapsUrl ? (
                                <a href={opt.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{opt.name}</a>
                              ) : opt.name}
                            </div>
                            <div className="text-gray-600 text-xs">{opt.cuisine}</div>
                            <div className="text-gray-500 text-xs mb-1">{opt.notes}</div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="bg-gray-100 px-2 py-1 rounded">{opt.estimatedCost}</span>
                              {opt.bookingUrl && <a href={opt.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Book</a>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Dinner */}
                    <div>
                      <div className="font-bold text-gray-700 mb-1">Dinner</div>
                      <div className="grid gap-2">
                        {day.foodSuggestions.dinnerOptions?.map((opt, idx) => (
                          <div 
                            key={idx} 
                            className={`
                              relative p-3 rounded-2xl border-2 transition-all duration-300 ease-in-out cursor-pointer bg-white shadow-md
                              ${selections[dayIdx].dinner === idx 
                                ? 'border-blue-500 shadow-xl scale-105' 
                                : 'border-gray-200 hover:shadow-lg hover:scale-[1.02]'
                              }
                            `}
                            onClick={() => !finalized && handleSelect(dayIdx, 'dinner', idx)}
                          >
                            {selections[dayIdx].dinner === idx && (
                              <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-lg z-10">
                                  <FaCheck size="0.8em" />
                              </div>
                            )}
                            <div className="font-semibold text-blue-800">
                              {opt.googleMapsUrl ? (
                                <a href={opt.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{opt.name}</a>
                              ) : opt.name}
                            </div>
                            <div className="text-gray-600 text-xs">{opt.cuisine}</div>
                            <div className="text-gray-500 text-xs mb-1">{opt.notes}</div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="bg-gray-100 px-2 py-1 rounded">{opt.estimatedCost}</span>
                              {opt.bookingUrl && <a href={opt.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Book</a>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Finalize Button */}
      {!finalized && (
        <div className="w-full flex justify-center mt-12 mb-8">
          <button
            onClick={handleFinalize}
            disabled={!allSelected}
            className={`bg-blue-600 text-white font-semibold px-10 py-4 rounded-2xl text-xl transition-all duration-300 shadow-lg ${allSelected ? 'hover:bg-blue-700 hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed'}`}
          >
            Finalize My Itinerary
          </button>
        </div>
      )}

      {/* General Tips */}
      {generalTips?.length > 0 && (
        <div className="w-full flex justify-center mt-16">
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-xl shadow max-w-2xl w-full">
            <h3 className="font-bold text-indigo-800 text-lg mb-1">General Tips for Your Trip</h3>
            <ul className="list-disc list-inside mt-2 space-y-1 text-base">
              {generalTips.map((tip, index) => <li key={index}>{tip}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Regenerate Button */}
      <div className="w-full flex justify-center mt-16 mb-10">
        <button onClick={onRegenerate} className="bg-blue-600 text-white font-semibold px-10 py-4 rounded-2xl text-xl transition-all duration-300 shadow-lg hover:bg-blue-700 hover:-translate-y-0.5">
          Plan Another Trip
        </button>
      </div>

      {/* Download/Print Buttons (show only after finalized) */}
      {finalized && (
        <div className="w-full flex justify-end px-8 pt-8 gap-4 print:hidden">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-700 transition-all duration-200"
          >
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;
