// LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaSignInAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

function LandingPage({ user }) {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', { credentials: 'include' });
      window.location.href = '/';
    } catch (err) {
      alert('Logout failed');
    }
  };

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
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
          {user ? (
            <>
              <button 
                onClick={() => navigate('/planner')} 
                className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-full cursor-pointer transition-all duration-300 hover:bg-green-600 hover:-translate-y-1 shadow-lg"
              >
                Planner
                <FaPaperPlane />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gray-800 text-white text-lg font-semibold rounded-full cursor-pointer transition-all duration-300 hover:bg-gray-900 hover:-translate-y-1 shadow-lg"
              >
                {user.picture ? (
                  <img src={user.picture} alt="avatar" className="w-8 h-8 rounded-full border-2 border-white mr-2" />
                ) : (
                  <FaUserCircle className="w-7 h-7 mr-2" />
                )}
                {user.name || user.email || 'Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white text-lg font-semibold rounded-full cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-1 shadow-lg"
              >
                Logout
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 shadow-lg"
              >
                Login
                <FaSignInAlt />
              </button>
              <button 
                onClick={() => navigate('/planner')} 
                className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-full cursor-pointer transition-all duration-300 hover:bg-green-600 hover:-translate-y-1 shadow-lg"
              >
                Planner
                <FaPaperPlane />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;