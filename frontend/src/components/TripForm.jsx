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

  //<form onSubmit={handleSubmit}>  // Not just a button click
  return (
    <form onSubmit={handleSubmit} className="trip-form">
      {step === 1 && (
        <div className="form-step">
          <h2>Basic Trip Information</h2>
          
          <div className="form-group">
            <label>Destination*</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date*</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date*</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Adults</label>
              <input
                type="number"
                name="adults"
                min="1"
                value={formData.adults}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Children</label>
              <input
                type="number"
                name="children"
                min="0"
                value={formData.children}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="button" onClick={nextStep} className="next-btn">
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="form-step">
          <h2>Trip Preferences</h2>

          <div className="form-group">
            <label>Budget</label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            >
              <option value="low">Budget</option>
              <option value="medium">Medium</option>
              <option value="high">Luxury</option>
            </select>
          </div>

          <div className="form-group">
            <label>Interests</label>
            <div className="checkbox-group">
              {interestsOptions.map(interest => (
                <label key={interest} className="checkbox-label">
                  <input
                    type="checkbox"
                    name="interests"
                    value={interest.toLowerCase()}
                    checked={formData.interests.includes(interest.toLowerCase())}
                    onChange={handleChange}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Food Preferences</label>
            <input
              type="text"
              name="foodPreferences"
              placeholder="Vegetarian, Vegan, etc."
              value={formData.foodPreferences}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button type="button" onClick={prevStep} className="back-btn">
              Back
            </button>
            <button type="button" onClick={nextStep} className="next-btn">
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="form-step">
          <h2>Accommodation & Transportation</h2>

          <div className="form-group">
            <label>Accommodation Type</label>
            <select
              name="accommodation"
              value={formData.accommodation}
              onChange={handleChange}
            >
              {accommodationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Transportation</label>
            <select
              name="transportation"
              value={formData.transportation}
              onChange={handleChange}
            >
              {transportationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-buttons">
            <button type="button" onClick={prevStep} className="back-btn">
              Back
            </button>
            <button type="submit" className="submit-btn">
              Generate Itinerary
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default TripForm;