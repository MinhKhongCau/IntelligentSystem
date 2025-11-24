import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PoliceDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/logout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-5">
      <div className="flex justify-between items-center mb-10 pb-5 border-b-2 border-gray-300">
        <h1 className="text-gray-800 text-4xl font-bold mx-auto">Police Dashboard</h1>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-gray-800 text-2xl font-semibold mb-3">Missing Persons</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-5">Manage and view missing person reports</p>
            <button 
              onClick={() => navigate('/missingpeople')}
              className="w-full py-3 px-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              View Reports
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-gray-800 text-2xl font-semibold mb-3">Active Alerts</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-5">Manage and view active alerts</p>
            <button 
              onClick={() => navigate('/locations')}
              className="w-full py-3 px-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Manage Alerts Locations
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-gray-800 text-2xl font-semibold mb-3">Map</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-5">View map of reported sightings</p>
            <button 
              onClick={() => navigate('/locations')}
              className="w-full py-3 px-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              View Map
            </button>
          </div>

          {/* <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-gray-800 text-2xl font-semibold mb-3">Surveillance</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-5">Access surveillance area</p>
            <button 
              onClick={() => window.open('/missinglocations', '_blank')}
              className="w-full py-3 px-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Open Surveillance
            </button>
          </div> */}

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-gray-800 text-2xl font-semibold mb-3">Manage Accounts</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-5">Create and delete user accounts</p>
            <button 
              onClick={() => navigate('/manage-accounts')}
              className="w-full py-3 px-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Manage Accounts
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-gray-800 text-2xl font-semibold mb-3">Manage Missing Forms</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-5">Create, accept, and reject missing person forms</p>
            <button 
              onClick={() => navigate('/manage-missing-forms')}
              className="w-full py-3 px-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Manage Forms
            </button>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all">
            <h3 className="text-gray-800 text-2xl font-semibold mb-3">Manage CCTV</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-5">Find missing list detect missing person from cctv</p>
            <button 
              onClick={() => navigate('/police/cctv-monitor')}
              className="w-full py-3 px-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              CCTV Monitor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
