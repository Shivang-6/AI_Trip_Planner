import React from 'react';

const ProfilePage = ({ user }) => {
  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="flex justify-center pt-16">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center w-full max-w-md">
        <img 
          src={user.photo} 
          alt={`${user.displayName}'s profile`} 
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-indigo-100" 
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.displayName}</h1>
        <p className="text-lg text-gray-500 mb-6">{user.email}</p>
        <p className="text-sm text-gray-600 border-t border-gray-200 pt-4 mt-4">
          Member since: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage; 