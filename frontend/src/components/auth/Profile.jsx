import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in to view personal information');
      setLoading(false);
      return;
    }

    // Mock user data - replace with actual API call
    const mockUser = {
      username: localStorage.getItem('username') || 'user123',
      fullName: 'John Doe',
      email: 'user@example.com',
      phoneNumber: '0123456789',
      userType: localStorage.getItem('userType') || 'VOLUNTEER',
      createdAt: '2024-01-01'
    };
    
    setUser(mockUser);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const getUserTypeText = (userType) => {
    switch (userType) {
      case 'POLICE':
        return 'Police';
      case 'CARE_PARTNER':
        return 'Care Partner';
      case 'VOLUNTEER':
        return 'Volunteer';
      default:
        return 'User';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign out
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-900">
                  {user.username}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-900">
                  {getUserTypeText(user.userType)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-900">
                  {user.fullName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-900">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-900">
                  {user.phoneNumber}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Created Date
                </label>
                <div className="bg-gray-50 px-3 py-2 rounded-md text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Link
                to="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ← Back to home
              </Link>
              
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Edit Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
