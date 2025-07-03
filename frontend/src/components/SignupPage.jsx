import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, displayName })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Signup failed');
      }
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-2">Create Your Account</h1>
      <p className="text-lg text-gray-600 mb-8">Sign up to start planning amazing trips.</p>
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          {error && <div className="text-red-600 text-sm text-left">{error}</div>}
          {success && <div className="text-green-600 text-sm text-left">Signup successful! Redirecting…</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing up…' : 'Sign up'}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate('/login')}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 