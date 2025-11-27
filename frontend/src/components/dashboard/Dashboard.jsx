import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, roles } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/logout');
  };

  const isCarePartner = roles.includes('CARE_PARTNER');

  console.log('User roles:', roles);
  console.log('Is Care Partner:', isCarePartner);
  return (
    <div className="min-h-screen p-5 bg-gradient-to-br from-gray-50 to-blue-200">
      <div className="flex items-center justify-between pb-10 mb-10 border-b-2 border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-5">
          <span className="text-lg font-medium text-gray-700">Welcome, {user ? user.username : 'Guest'}!</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">Missing Persons</h3>
            <p className="mb-5 text-base leading-relaxed text-gray-600">Manage and view missing person reports</p>
            <button 
              onClick={() => navigate('/Missingpeople')}
              className="w-full px-5 py-3 text-base font-medium text-white rounded-lg cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
            >
              View Reports
            </button>
          </div>

          {isCarePartner ? (
            <div className="p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
              <h3 className="mb-3 text-2xl font-semibold text-gray-800">Report Missing Person</h3>
              <p className="mb-5 text-base leading-relaxed text-gray-600">Submit a new missing person report</p>
              <button 
                onClick={() => navigate('/formmissing')}
                className="w-full px-5 py-3 text-base font-medium text-white rounded-lg cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
              >
                Submit Report
              </button>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
              <h3 className="mb-3 text-2xl font-semibold text-gray-800">Report Missing Person</h3>
              <p className="mb-5 text-base leading-relaxed text-gray-600">You must be a care partner to submit a report</p>
              <button 
                className="w-full px-5 py-3 text-base font-medium text-white rounded-lg cursor-not-allowed bg-gray-400 shadow-none"
                onClick={() => navigate('/formmissing')}
                disabled
              >
                Submit a report
              </button>
            </div>
            )
          }
          
          <div className="p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">Tracked Locations</h3>
            <p className="mb-5 text-base leading-relaxed text-gray-600">View location tracking data</p>
            <button 
              onClick={() => navigate('/locations')}
              className="w-full px-5 py-3 text-base font-medium text-white rounded-lg cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
            >
              View Locations
            </button>
          </div>

          {/* <div className="p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">Surveillance</h3>
            <p className="mb-5 text-base leading-relaxed text-gray-600">Access surveillance area</p>
            <button 
              onClick={() => navigate('/missinglocations')}
              className="w-full px-5 py-3 text-base font-medium text-white rounded-lg cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
            >
              Open Surveillance
            </button>
          </div> */}

        {isCarePartner ? (
          <div className="p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">Register Care Partner</h3>
              <>
                <p className="mb-5 text-base leading-relaxed text-gray-600">You are already registered as a care partner.</p>
                <button 
                  onClick={() => navigate('/manage-reported-documents')}
                  className="w-full px-5 py-3 text-base font-medium text-white rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-none">
                  Manage Reports
                </button>
              </>
          </div>
          ) : (
          <div className="p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:translate-y-[-5px] hover:shadow-2xl">
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">Register Care Partner</h3>
              <>
                <p className="mb-5 text-base leading-relaxed text-gray-600">Register a new care partner account</p>
                <button onClick={() => navigate('/register-care-partner')} className="w-full px-5 py-3 text-base font-medium text-white rounded-lg cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg">
                  Register
                </button>
              </>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
