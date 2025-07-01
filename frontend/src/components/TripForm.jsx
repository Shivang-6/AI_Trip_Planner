import React, { useState } from 'react';

const TripForm = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    budget: 'medium',
    budgetPerPerson: 5000,
    
    interests: [],
    foodPreferences: '',
    accommodation: 'hotel',
    transportation: 'mixed'
  });

  const interestsOptions = [
    'Sightseeing', 'Adventure', 'Food', 'History', 
    'Nature', 'Shopping', 'Relaxation', 'Culture'
  ];

  const accommodationOptions = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'airbnb', label: 'Airbnb' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'resort', label: 'Resort' }
  ];

  const transportationOptions = [
    { value: 'public', label: 'Public Transport' },
    { value: 'rental', label: 'Car Rental' },
    { value: 'mixed', label: 'Mixed' },
    { value: 'walking', label: 'Walking' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        interests: checked 
          ? [...prev.interests, value]
          : prev.interests.filter(i => i !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    // Basic validation before proceeding
    if (step === 1 && (!formData.destination || !formData.startDate || !formData.endDate)) {
      alert('Please fill in all required fields');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Base styles for reuse
  const inputBaseStyle = "w-full p-3 border border-gray-300 rounded-lg text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
  const labelBaseStyle = "block font-medium text-gray-700 mb-2";
  const buttonBaseStyle = "px-6 py-3 text-base font-semibold rounded-lg border-none cursor-pointer transition-all duration-200";
  const primaryButton = `${buttonBaseStyle} bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 shadow-md`;
  const secondaryButton = `${buttonBaseStyle} bg-gray-200 text-gray-800 hover:bg-gray-300`;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-8 sm:p-10 rounded-xl shadow-lg mt-6 transition-all duration-300">
      {/* Progress Bar */}
      <div className="flex justify-between rounded-lg overflow-hidden mb-8 bg-gray-200">
        <div className={`p-3 text-center font-medium transition-all duration-400 w-1/3 ${step >= 1 ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Basic Info</div>
        <div className={`p-3 text-center font-medium transition-all duration-400 w-1/3 ${step >= 2 ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Preferences</div>
        <div className={`p-3 text-center font-medium transition-all duration-400 w-1/3 ${step >= 3 ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Logistics</div>
      </div>

      {step === 1 && (
        <div className="flex flex-col">
          <h2 className="text-3xl text-gray-800 mb-6 font-bold">Basic Trip Information</h2>
          <div className="mb-6">
            <label className={labelBaseStyle}>Destination*</label>
            <input type="text" name="destination" value={formData.destination} onChange={handleChange} required className={inputBaseStyle} />
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelBaseStyle}>Start Date*</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={inputBaseStyle} />
            </div>
            <div>
              <label className={labelBaseStyle}>End Date*</label>
              <input type="date" name="endDate" value={formData.endDate} min={formData.startDate} onChange={handleChange} required className={inputBaseStyle} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelBaseStyle}>Adults</label>
              <input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} className={inputBaseStyle} />
            </div>
            <div>
              <label className={labelBaseStyle}>Children</label>
              <input type="number" name="children" min="0" value={formData.children} onChange={handleChange} className={inputBaseStyle} />
            </div>
          </div>
          <button type="button" onClick={nextStep} className={`${primaryButton} self-end`}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col">
          <h2 className="text-3xl text-gray-800 mb-6 font-bold">Trip Preferences</h2>
          <div className="mb-6">
            <label className={labelBaseStyle}>Budget</label>
            <select name="budget" value={formData.budget} onChange={handleChange} className={inputBaseStyle}>
              <option value="low">Budget</option>
              <option value="medium">Medium</option>
              <option value="high">Luxury</option>
            </select>
          </div>
          <div className="mb-6">
            <label className={labelBaseStyle} htmlFor="budgetPerPerson">Budget per Person (₹)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="budgetPerPerson"
                name="budgetPerPerson"
                min="1000"
                max="20000"
                step="500"
                value={formData.budgetPerPerson}
                onChange={e => setFormData(prev => ({ ...prev, budgetPerPerson: Number(e.target.value) }))}
                className="w-full accent-blue-600"
              />
              <span className="font-semibold text-blue-700 min-w-[80px]">₹{formData.budgetPerPerson.toLocaleString()}</span>
            </div>
          </div>
          <div className="mb-6">
            <label className={labelBaseStyle}>Interests</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {interestsOptions.map(interest => (
                <label key={interest} className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-200">
                  <input type="checkbox" name="interests" value={interest.toLowerCase()} checked={formData.interests.includes(interest.toLowerCase())} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
                  {interest}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className={labelBaseStyle}>Food Preferences</label>
            <input type="text" name="foodPreferences" placeholder="Vegetarian, Vegan, etc." value={formData.foodPreferences} onChange={handleChange} className={inputBaseStyle} />
          </div>
          <div className="flex justify-between mt-8">
            <button type="button" onClick={prevStep} className={secondaryButton}>Back</button>
            <button type="button" onClick={nextStep} className={primaryButton}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col">
          <h2 className="text-3xl text-gray-800 mb-6 font-bold">Accommodation & Transportation</h2>
          <div className="mb-6">
            <label className={labelBaseStyle}>Accommodation Type</label>
            <select name="accommodation" value={formData.accommodation} onChange={handleChange} className={inputBaseStyle}>
              {accommodationOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div className="mb-6">
            <label className={labelBaseStyle}>Transportation</label>
            <select name="transportation" value={formData.transportation} onChange={handleChange} className={inputBaseStyle}>
              {transportationOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div className="flex justify-between mt-8">
            <button type="button" onClick={prevStep} className={secondaryButton}>Back</button>
            <button type="submit" className={primaryButton}>Generate Itinerary</button>
          </div>
        </div>
      )}
    </form>
  );
};

export default TripForm;