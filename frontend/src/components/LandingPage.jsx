// LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaSignInAlt } from 'react-icons/fa';

function LandingPage({ user }) {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex items-center justify-center h-screen w-screen text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
      <div className="relative z-20 p-8">
        <h1 className="text-6xl font-bold mb-4" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)' }}>
          Your Personal AI Trip Planner
        </h1>
        <p className="text-2xl font-light mb-10" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)' }}>
          Craft your perfect journey with intelligent, personalized itineraries.
        </p>
        
        {user ? (
          <button 
            onClick={() => navigate('/planner')} 
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 shadow-lg"
          >
            Go to Planner
            <FaPaperPlane />
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 shadow-lg"
          >
            Login to Start
            <FaSignInAlt />
          </button>
        )}
      </div>
    </div>
  );
}

export default LandingPage;