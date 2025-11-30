import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FaceComparisonModal from './FaceComparisonModal';
import ReportFoundForm from './ReportFoundForm';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MissingDocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonModal, setComparisonModal] = useState({
    isOpen: false,
    reportImage: null,
    reportId: null
  });
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    fetchDocumentAndReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDocumentAndReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch document details
      const docResponse = await axios.get(`${API_BASE}/api/missing-documents/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDocument(docResponse.data);

      // Fetch reports
      const reportsResponse = await axios.get(`${API_BASE}/api/missing-documents/reports/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReports(reportsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load document details');
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
      case 'pending':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800';
      case 'rejected':
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800';
      default:
        return 'px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Document not found'}</p>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Missing Person Details</h1>
          </div>
          {document.caseStatus === 'Missing' && (
            <button
              onClick={() => setShowReportForm(true)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
            >
              <span>📍</span>
              Report Found
            </button>
          )}
        </div>

        {/* Document Details */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={`${API_BASE}${document.facePictureUrl}`}
              alt={document.name}
              className="w-full md:w-64 h-64 object-cover rounded-lg border-4 border-gray-300"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{document.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{document.gender ? 'Female' : 'Male'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Birthday</p>
                  <p className="font-medium">{formatDateTime(document.birthday)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-medium">{document.height ? `${document.height} cm` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium">{document.weight ? `${document.weight} kg` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Missing Since</p>
                  <p className="font-medium">{formatDateTime(document.missingTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={getStatusBadgeClass(document.caseStatus)}>
                    {document.caseStatus || 'Unknown'}
                  </span>
                </div>
                {document.identifyingCharacteristic && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Identifying Characteristics</p>
                    <p className="font-medium">{document.identifyingCharacteristic}</p>
                  </div>
                )}
                {document.missingArea && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Last Seen Area</p>
                    <p className="font-medium">
                      {document.missingArea.commune && `${document.missingArea.commune}, `}
                      {document.missingArea.district && `${document.missingArea.district}, `}
                      {document.missingArea.province}, {document.missingArea.country}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-5">
            Volunteer Reports ({reports.length})
          </h2>

          {reports.length === 0 ? (
            <div className="bg-white rounded-lg p-10 text-center text-gray-600">
              No reports submitted yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-gray-100">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Report #{report.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        By: <strong>{report.volunteerName}</strong>
                      </p>
                    </div>
                    <span className={getStatusBadgeClass(report.reportStatus)}>
                      {report.reportStatus || 'Pending'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <strong>Time:</strong> {formatDateTime(report.reportTime)}
                    </div>

                    {report.sightingPicture && (
                      <div className="w-full rounded-lg overflow-hidden">
                        <img
                          src={`${API_BASE}${report.sightingPicture}`}
                          alt="Sighting"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = '/default-image.png';
                          }}
                        />
                      </div>
                    )}

                    {report.description && (
                      <div className="text-gray-700">
                        <strong className="block mb-1 text-gray-800">Description:</strong>
                        <p className="text-sm leading-relaxed">{report.description}</p>
                      </div>
                    )}

                    {report.sightingArea && (
                      <div className="text-sm text-gray-700">
                        <strong className="block mb-1 text-gray-800">Location:</strong>
                        <p>
                          {report.sightingArea.commune && `${report.sightingArea.commune}, `}
                          {report.sightingArea.district && `${report.sightingArea.district}, `}
                          {report.sightingArea.province}, {report.sightingArea.country}
                        </p>
                        {(report.latitude && report.longitude) && (
                          <p className="text-xs text-gray-500 italic mt-1">
                            Coordinates: {report.latitude}, {report.longitude}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Compare Faces Button */}
                    {report.sightingPicture && (
                      <button
                        onClick={() => setComparisonModal({
                          isOpen: true,
                          reportImage: report.sightingPicture,
                          reportId: report.id
                        })}
                        className="w-full mt-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                      >
                        🔍 Compare Faces
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Face Comparison Modal */}
      <FaceComparisonModal
        isOpen={comparisonModal.isOpen}
        onClose={() => setComparisonModal({ isOpen: false, reportImage: null, reportId: null })}
        missingPersonImage={document?.facePictureUrl}
        reportImage={comparisonModal.reportImage}
        missingPersonName={document?.name}
        reportId={comparisonModal.reportId}
      />

      {/* Report Found Form Modal */}
      {showReportForm && (
        <ReportFoundForm
          missingDocumentId={id}
          onClose={() => setShowReportForm(false)}
          onSuccess={() => {
            fetchDocumentAndReports();
            setShowReportForm(false);
          }}
        />
      )}
    </div>
  );
};

export default MissingDocumentDetail;
