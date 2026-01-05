import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MyFoundCases = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myFoundCases, setMyFoundCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchMyFoundCases();
  }, []);

  const fetchMyFoundCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all reports from all missing documents
      const response = await axios.get(`${API_BASE}/api/missing-documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Get all reports from all missing documents and filter by current user
      const allReports = [];
      for (const document of response.data) {
        try {
          const reportsResponse = await axios.get(`${API_BASE}/api/missing-documents/reports/${document.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          // Add document info to each report and filter by current user
          const userReports = reportsResponse.data
            .filter(report => report.volunteerId === user?.id)
            .map(report => ({
              ...report,
              missingDocument: document
            }));
          
          allReports.push(...userReports);
        } catch (err) {
          console.error(`Error fetching reports for document ${document.id}:`, err);
        }
      }

      setMyFoundCases(allReports);
      setFilteredCases(allReports);
    } catch (err) {
      console.error('Error fetching my found cases:', err);
      setError('Failed to load your found cases');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort cases
  useEffect(() => {
    let filtered = [...myFoundCases];

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.reportTime) - new Date(a.reportTime);
        case 'oldest':
          return new Date(a.reportTime) - new Date(b.reportTime);
        case 'name':
          return (a.missingDocument?.name || '').localeCompare(b.missingDocument?.name || '');
        default:
          return 0;
      }
    });

    setFilteredCases(filtered);
  }, [myFoundCases, sortBy]);

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString('vi-VN');
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'missing':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800';
      case 'found':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800';
      case 'rejected':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800';
      default:
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700';
    }
  };

  const formatLocation = (area) => {
    if (!area) return 'Unknown';
    const parts = [];
    if (area.commune) parts.push(area.commune);
    if (area.district) parts.push(area.district);
    if (area.province) parts.push(area.province);
    if (area.country) parts.push(area.country);
    return parts.join(', ');
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/missing-documents/reports/${reportId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Refresh the data
      fetchMyFoundCases();
      setDeleteConfirm(null);
      setSuccessMessage('Report deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting report:', err);
      setError('Failed to delete report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Found Cases</h1>
              <p className="text-sm text-gray-600 mt-1">
                {myFoundCases.length} report(s) submitted
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchMyFoundCases}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
            >
              <span>🔄</span>
              Refresh
            </button>
            <button
              onClick={() => navigate('/missingpeople')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
            >
              <span>📍</span>
              Report New Finding
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {/* Statistics */}
        {myFoundCases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-gray-800">
                {myFoundCases.length}
              </div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(myFoundCases.map(c => c.missingDocument?.id)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Cases</div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        {myFoundCases.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-md mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">By Person Name</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredCases.length} reports
              </div>
            </div>
          </div>
        )}

        {myFoundCases.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center text-gray-600">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg mb-4">You haven't reported any found cases yet</p>
            <p className="text-sm mb-6 text-gray-500">
              Help find missing persons by reporting sightings when you see them
            </p>
            <button
              onClick={() => navigate('/missingpeople')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Browse Missing Persons
            </button>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center text-gray-600">
            <p className="text-lg mb-4">No reports found</p>
            <button
              onClick={() => setSortBy('newest')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Reset Sort
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCases.map((foundCase) => (
              <div key={foundCase.id} className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Report #{foundCase.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      For: <strong>{foundCase.missingDocument?.name}</strong>
                    </p>
                  </div>
                </div>

                {foundCase.sightingPicture && (
                  <div className="w-full rounded-lg overflow-hidden mb-4">
                    <img
                      src={`${API_BASE}${foundCase.sightingPicture}`}
                      alt="Sighting"
                      className="w-full h-48 object-cover"
                      // onError={(e) => {
                      //   e.target.src = '/default-image.png';
                      // }}
                    />
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    <strong>Reported:</strong> {formatDateTime(foundCase.reportTime)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Location:</strong> {formatLocation(foundCase.sightingArea)}
                  </div>
                  {(foundCase.latitude && foundCase.longitude) && (
                    <div className="text-xs text-gray-500">
                      Coordinates: {foundCase.latitude}, {foundCase.longitude}
                    </div>
                  )}
                  {foundCase.description && (
                    <div className="text-sm text-gray-600">
                      <strong>Description:</strong> 
                      <p className="mt-1 text-gray-700">{foundCase.description}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/missing-document/${foundCase.missingDocument?.id}`)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                  >
                    View Case
                  </button>
                  <button
                    onClick={() => navigate(`/my-found-cases/edit/${foundCase.id}`)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Update Case
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(foundCase.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Report</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this report? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteReport(deleteConfirm)}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFoundCases;