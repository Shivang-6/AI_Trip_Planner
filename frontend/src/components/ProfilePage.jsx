import React, { useEffect, useState } from 'react';

const ProfilePage = ({ user }) => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Fallback avatar
  const AVATAR_PLACEHOLDER = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.displayName || user?.email || 'User');

  // User type badge
  const userType = user?.googleId ? 'Google' : 'Email';

  useEffect(() => {
    const fetchItins = async () => {
      try {
        const res = await fetch('http://localhost:5000/auth/api/itineraries', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setItineraries(data.itineraries || []);
        }
      } catch {}
      setLoading(false);
    };
    if (user) fetchItins();
  }, [user]);

  const handleDelete = async idx => {
    setDeleting(idx);
    // TODO: Implement backend delete route and call it here
    setTimeout(() => {
      setItineraries(itineraries => itineraries.filter((_, i) => i !== idx));
      setDeleting(null);
    }, 700);
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="flex flex-col items-center pt-0 px-2 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Banner */}
      <div className="w-full h-40 sm:h-56 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-end justify-center relative mb-[-64px] sm:mb-[-80px]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          <img 
            src={user.photo || AVATAR_PLACEHOLDER} 
            alt={`${user.displayName || user.email}'s profile`} 
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover bg-white" 
          />
        </div>
      </div>
      {/* Profile Card */}
      <div className="bg-white p-10 rounded-xl shadow-lg text-center w-full max-w-md mt-20 mb-10 relative z-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          {user.displayName || user.email}
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ml-2 ${userType === 'Google' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{userType} User</span>
        </h1>
        <p className="text-lg text-gray-500 mb-4">{user.email}</p>
        <p className="text-sm text-gray-600 border-t border-gray-200 pt-4 mt-4">
          Member since: {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-all duration-200">Edit Profile</button>
      </div>
      {/* Saved Itineraries */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-8 mb-16 animate-fade-in">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Saved Itineraries</h2>
        {loading ? (
          <div>Loading itineraries…</div>
        ) : itineraries.length === 0 ? (
          <div className="text-gray-500">No saved itineraries yet.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {itineraries.map((itin, idx) => (
              <div key={idx} className={`relative bg-blue-50 rounded-2xl p-6 flex flex-col gap-2 shadow-md border border-blue-100 hover:shadow-xl transition-all duration-200 ${deleting === idx ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700">
                    {itin.destination?.[0] || 'T'}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-blue-800">{itin.destination}</div>
                    <div className="text-xs text-gray-500 mt-1">{itin.days?.[0]?.title} - {itin.days?.[itin.days.length-1]?.title}</div>
                  </div>
                </div>
                <div className="text-gray-600 text-sm mb-2 line-clamp-3">{itin.tripSummary || 'Trip summary'}</div>
                <div className="flex gap-2 mt-auto">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200">View</button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200">Download PDF</button>
                  <button onClick={() => handleDelete(idx)} disabled={deleting === idx} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 disabled:opacity-50">Delete</button>
                </div>
                {deleting === idx && <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-blue-700 font-bold text-lg rounded-2xl">Deleting…</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 