import { useState } from 'react';
import axios from 'axios';
import ImageUploader from '../common/ImageUploader';
import AddMissingArea from '../missing-form/AddmissingArea';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const ReportFoundForm = ({ missingDocumentId, onClose, onSuccess }) => {
  const [reportData, setReportData] = useState({
    description: '',
    sightingPicture: '',
    sightingArea: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddArea, setShowAddArea] = useState(false);

  const handleImageUpdate = (imageUrl) => {
    setReportData(prev => ({ ...prev, sightingPicture: imageUrl }));
  };

  const handleAreaAdded = (newArea) => {
    setReportData(prev => ({ ...prev, sightingArea: newArea }));
    setShowAddArea(false);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportData.sightingArea) {
      alert('Please add a sighting location.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('User not found. Please log in.');
        setIsSubmitting(false);
        return;
      }

      const user = JSON.parse(userStr);
      const volunteerId = user?.id;

      if (!volunteerId) {
        alert('Volunteer ID not found. Please log in as a volunteer.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('missingDocumentId', missingDocumentId);
      formData.append('volunteerId', volunteerId);
      formData.append('description', reportData.description);
      formData.append('sightingPicture', reportData.sightingPicture);
      formData.append('sightingAreaId', reportData.sightingArea.id);

      const response = await axios.post(`${API_BASE}/api/missing-documents/submit-missing-person`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Report submitted successfully!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(error.response?.data || 'An error occurred while submitting the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showAddArea) {
    return (
      <AddMissingArea 
        onAreaAdded={handleAreaAdded}
        onClose={() => setShowAddArea(false)}
      />
    );
  }

  return (
    <form onSubmit={handleReportSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          required
          rows="4"
          value={reportData.description}
          onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          placeholder="Describe where and when you saw this person..."
        />
      </div>

      <ImageUploader 
        currentImage={reportData.sightingPicture}
        onImageUpdate={handleImageUpdate}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sighting Location *
        </label>
        {reportData.sightingArea ? (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
            <p className="text-sm text-gray-900">
              {reportData.sightingArea.commune && `${reportData.sightingArea.commune}, `}
              {reportData.sightingArea.district && `${reportData.sightingArea.district}, `}
              {reportData.sightingArea.province}, {reportData.sightingArea.country}
            </p>
            <button
              type="button"
              onClick={() => setReportData({ ...reportData, sightingArea: null })}
              className="text-sm text-red-600 hover:text-red-800 mt-2"
            >
              Remove Location
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddArea(true)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Add Sighting Location
          </button>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium disabled:bg-orange-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  );
};

export default ReportFoundForm;
