import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CarePartnerDashboard = () => {
  const [stats, setStats] = useState({
    myReports: 0,
    activeReports: 0,
    volunteersHelping: 0,
    updatesReceived: 0
  });
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      myReports: 2,
      activeReports: 1,
      volunteersHelping: 5,
      updatesReceived: 12
    });

    setMyReports([
      { id: 1, name: 'Trần Thị Mai', status: 'MISSING', reportedDate: '2024-01-15', lastUpdate: '2024-01-20' },
      { id: 2, name: 'Nguyễn Văn Nam', status: 'FOUND', reportedDate: '2024-01-10', lastUpdate: '2024-01-18' }
    ]);

    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'MISSING':
        return 'bg-red-100 text-red-800';
      case 'FOUND':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'MISSING':
        return 'Missing';
      case 'FOUND':
        return 'Found';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-900">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Care Partner Dashboard</h1>
          <p className="mt-2 text-gray-600">Track reports and receive support from the community</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">MR</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">My Reports</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.myReports}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AR</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Reports</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.activeReports}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">VH</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Volunteers Helping</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.volunteersHelping}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">UR</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Updates Received</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.updatesReceived}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/Formmissing"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-center font-medium"
              >
                Create New Report
              </Link>
              <Link
                to="/volunteer-coordination"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center font-medium"
              >
                Coordinate Volunteers
              </Link>
              <Link
                to="/profile"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-center font-medium"
              >
                Update Information
              </Link>
            </div>
          </div>
        </div>

        {/* My Reports */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Reports</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Update
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.reportedDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.lastUpdate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/case-details/${report.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-2">Support Information</h3>
          <p className="text-green-800 mb-4">
            If you need additional support or have new information about missing family members, 
            please contact us via hotline: 1900-xxxx
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Contact Support
            </button>
            <button className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-4 py-2 rounded-md text-sm font-medium">
              Update Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarePartnerDashboard;
