import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import ImageUploader from '../common/ImageUploader';
import AddMissingArea from '../missing-form/AddmissingArea';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const EditFoundCase = () => {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [areas, setAreas] = useState([]);
  
  const [formData, setFormData] = useState({
    description: '',
    sightingAreaId: '',
    latitude: '',
    longitude: '',
    sightingPicture: ''
  });
  
  const [originalReport, setOriginalReport] = useState(null);
  const [showAddArea, setShowAddArea] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    fetchReportData();
    fetchAreas();
  }, [reportId]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // We need to find the report by searching through all missing documents
      const response = await axios.get(`${API_BASE}/api/missing-documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      let foundReport = null;
      for (const document of response.data) {
        try {
          const reportsResponse = await axios.get(`${API_BASE}/api/missing-documents/reports/${document.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const report = reportsResponse.data.find(r => r.id === parseInt(reportId) && r.volunteerId === user?.id);
          if (report) {
            foundReport = { ...report, missingDocument: document };
            break;
          }
        } catch (err) {
          console.error(`Error fetching reports for document ${document.id}:`, err);
        }
      }

      if (!foundReport) {
        setError('Report not found or you do not have permission to edit it');
        return;
      }

      setOriginalReport(foundReport);
      setFormData({
        description: foundReport.description || '',
        sightingAreaId: foundReport.sightingArea?.id || '',
        latitude: foundReport.latitude || '',
        longitude: foundReport.longitude || '',
        sightingPicture: foundReport.sightingPicture || ''
      });
      
      // Set selected area if exists
      if (foundReport.sightingArea) {
        setSelectedArea(foundReport.sightingArea);
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/areas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAreas(response.data);
    } catch (err) {
      console.error('Error fetching areas:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update selected area when dropdown changes
    if (name === 'sightingAreaId') {
      const area = areas.find(a => a.id === parseInt(value));
      setSelectedArea(area || null);
    }
  };

  const handleImageUpdate = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      sightingPicture: imageUrl
    }));
  };

  const handleAreaAdded = (newArea) => {
    setAreas(prev => [...prev, newArea]);
    setSelectedArea(newArea);
    setFormData(prev => ({
      ...prev,
      sightingAreaId: newArea.id
    }));
    setShowAddArea(false);
  };

  const handleRemoveArea = () => {
    setSelectedArea(null);
    setFormData(prev => ({
      ...prev,
      sightingAreaId: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!formData.sightingAreaId && !selectedArea) {
      setError('Sighting area is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const token = localStorage.getItem('token');

      const updateData = new URLSearchParams();
      updateData.append('description', formData.description);
      updateData.append('sightingAreaId', formData.sightingAreaId);
      
      if (formData.latitude) {
        updateData.append('latitude', formData.latitude);
      }
      if (formData.longitude) {
        updateData.append('longitude', formData.longitude);
      }
      if (formData.sightingPicture) {
        updateData.append('sightingPicture', formData.sightingPicture);
      }

      await axios.put(`${API_BASE}/api/missing-documents/reports/${reportId}`, updateData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      navigate('/my-found-cases');
    } catch (err) {
      console.error('Error updating report:', err);
      setError(err.response?.data || 'Failed to update report');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !originalReport) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/my-found-cases')}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to My Found Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-5 mb-8">
          <button
            onClick={() => navigate('/my-found-cases')}
            className="px-5 py-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to My Found Cases
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Found Case Report</h1>
            <p className="text-sm text-gray-600 mt-1">
              Report #{reportId} for {originalReport?.missingDocument?.name}
            </p>
          </div>
        </div>

        {/* Original Report Info */}
        {originalReport && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Original Report Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Missing Person</p>
                <p className="font-medium">{originalReport.missingDocument?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Original Report Time</p>
                <p className="font-medium">{new Date(originalReport.reportTime).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-medium">{formatLocation(originalReport.sightingArea)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Coordinates</p>
                <p className="font-medium">
                  {originalReport.latitude && originalReport.longitude 
                    ? `${originalReport.latitude}, ${originalReport.longitude}`
                    : 'Not specified'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Update Report Details</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <ImageUploader
              currentImage={formData.sightingPicture}
              onImageUpdate={handleImageUpdate}
              className="mb-6"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe what you saw, when, and any other relevant details..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sighting Location *
              </label>
              {selectedArea ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatLocation(selectedArea)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedArea.latitude && selectedArea.longitude 
                          ? `Coordinates: ${selectedArea.latitude}, ${selectedArea.longitude}`
                          : 'No coordinates available'
                        }
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveArea}
                      className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Change Location
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <select
                    name="sightingAreaId"
                    value={formData.sightingAreaId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select an existing location</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {formatLocation(area)}
                      </option>
                    ))}
                  </select>
                  <div className="text-center">
                    <span className="text-sm text-gray-500">or</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddArea(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    + Add New Sighting Location
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (Optional)
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 10.7769"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (Optional)
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 106.7009"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update Report'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-found-cases')}
                className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Add Area Modal */}
        {showAddArea && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
              <div className="flex-shrink-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Add Sighting Location</h3>
                <button
                  onClick={() => setShowAddArea(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <AddMissingArea
                  onAreaAdded={handleAreaAdded}
                  onClose={() => setShowAddArea(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditFoundCase;