import { FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md w-full">
      <Link to="/planner" className="text-2xl font-bold text-gray-800 no-underline">AI Trip Planner</Link>
      {user && (
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <img src={user.photo} alt={user.displayName} className="w-10 h-10 rounded-full" />
          </Link>
          <span className="hidden sm:inline">Welcome, {user.displayName}!</span>
          <button onClick={handleLogout} className="bg-transparent border-none text-xl cursor-pointer text-gray-600 hover:text-black">
            <FaSignOutAlt />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header; 