import { FaGoogle } from 'react-icons/fa';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
      <p className="text-lg text-gray-600 mb-8">Sign in to plan your next adventure.</p>
      <button 
        onClick={handleGoogleLogin} 
        className="inline-flex items-center gap-4 px-6 py-3 bg-[#4285F4] text-white font-semibold rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#357ae8] shadow-md"
      >
        <FaGoogle size="1.2em" />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default LoginPage; 