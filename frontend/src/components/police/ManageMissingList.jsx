import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const ManageMissingList = () => {
  const [documents, setDocuments] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/missing-documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: searchTerm ? { name: searchTerm } : {}
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching missing documents:', error);
      showNotification('Error fetching documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleSearch = () => {
    fetchDocuments();
  };

  const handleViewDetails = (id) => {
    navigate(`/missing-document/${id}`);
  };

  const updateDocumentStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE}/api/missing-documents/${id}/update-status?status=${status}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        showNotification(`Document ${status.toLowerCase()} successfully!`, 'success');
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error updating document:', error);
      showNotification(error.response?.data || 'Error updating document', 'error');
    }
  };

  const handleAccept = (id) => {
    updateDocumentStatus(id, 'Accepted');
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this document?')) {
      updateDocumentStatus(id, 'Rejected');
    }
  };

  const handleMarkAsFound = (id) => {
    if (window.confirm('Mark this person as found?')) {
      updateDocumentStatus(id, 'Found');
    }
  };

  const handleSearchAgain = (id) => {
    if (window.confirm('Mark this person as missing again?')) {
      updateDocumentStatus(id, 'Missing');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'missing':
        return 'bg-red-100 text-red-800';
      case 'found':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {notification.message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Missing Forms</h1>
        
        {/* Search Bar */}
        <div className="mb-6 flex gap-3">
          <input
            type="search"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-10 text-gray-600">No missing persons found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleViewDetails(doc.id)}
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={`${API_BASE}${doc.facePictureUrl}`}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.caseStatus)}`}>
                      {doc.caseStatus || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{doc.name}</h3>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p><span className="font-medium">ID:</span> {doc.id}</p>
                    <p><span className="font-medium">Missing Since:</span> {formatDate(doc.missingTime)}</p>
                    <p><span className="font-medium">Report Date:</span> {formatDate(doc.reportDate)}</p>
                    {doc.missingArea && (
                      <p><span className="font-medium">Area:</span> {doc.missingArea.province}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleViewDetails(doc.id)}
                      className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                    
                    {/* Show different buttons based on status */}
                    {(doc.caseStatus === 'Found' || doc.caseStatus === 'Rejected') ? (
                      <button
                        onClick={() => handleSearchAgain(doc.id)}
                        className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm font-medium"
                      >
                        Search Again
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        {doc.caseStatus === 'Missing' && (
                          <button
                            onClick={() => handleMarkAsFound(doc.id)}
                            className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            Mark Found
                          </button>
                        )}
                        <button
                          onClick={() => handleReject(doc.id)}
                          className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMissingList;
