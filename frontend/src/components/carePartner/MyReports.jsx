import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MyReports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myReports, setMyReports] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch when page changes
    fetchMyReports(page);
  }, [page]);

  // Debounce search input and trigger a fresh fetch
  useEffect(() => {
    const handler = setTimeout(() => {
      // Reset to first page and fetch results for search term
      setPage(0);
      fetchMyReports(0, searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchMyReports = async (p = page, s = searchTerm) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!user || !user.id) {
        setMyReports([]);
        setLoading(false);
        return;
      }
      // Fetch missing documents that this user (care partner) reported/created
      const response = await axios.get(`${API_BASE}/api/missing-documents/search`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { page: p, size, name: s, reporterId: user.id }
      });

      const data = response.data;
      const list = Array.isArray(data) ? data : (data.content || []);
      setMyReports(list);
      if (data && data.totalPages !== undefined) setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching my reports:', err);
      setError('Failed to load your reports');
    } finally {
      setLoading(false);
    }
  };

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
      case 'accepted':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800';
      default:
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700';
    }
  };

  const handleEditReport = (reportId) => {
    navigate(`/my-reports/edit/${reportId}`);
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
            <h1 className="text-3xl font-bold text-gray-800">My Reports</h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports by person, area, or description"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72"
            />
            <button
              onClick={() => navigate('/formmissing')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
            >
              <span>+</span>
              Create New Report
            </button>
          </div>
        </div>

        {myReports.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center text-gray-600">
            <p className="text-lg mb-4">You haven't created any missing-person reports yet</p>
            <button
              onClick={() => navigate('/formmissing')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Create Your First Report
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myReports.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
                  <span className={getStatusBadgeClass(doc.caseStatus)}>{doc.caseStatus || 'Unknown'}</span>
                </div>

                {doc.facePictureUrl && (
                  <div className="w-full rounded-lg overflow-hidden mb-4">
                    <img
                      src={doc.facePictureUrl.startsWith('http') ? doc.facePictureUrl : `${API_BASE}${doc.facePictureUrl}`}
                      alt={`missing-${doc.id}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600"><strong>Missing Since:</strong> {formatDateTime(doc.missingTime)}</div>
                  {doc.missingArea && (
                    <div className="text-sm text-gray-600"><strong>Area:</strong> {doc.missingArea.province}, {doc.missingArea.country}</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/missing-document/${doc.id}`)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                  >View Missing Document</button>
                  <button
                    onClick={() => handleEditReport(doc.id)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >Edit Report</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => { if (page > 0) setPage(p => p - 1); }}
            disabled={page <= 0}
            className={`px-4 py-2 rounded ${page <= 0 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
          >Prev</button>
          <div className="text-sm text-gray-700">Page {page + 1} {totalPages ? `of ${totalPages}` : ''}</div>
          <button
            onClick={() => { if (totalPages === 0 || page + 1 < totalPages) setPage(p => p + 1); }}
            disabled={totalPages > 0 && page + 1 >= totalPages}
            className={`px-4 py-2 rounded ${totalPages > 0 && page + 1 >= totalPages ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default MyReports;
