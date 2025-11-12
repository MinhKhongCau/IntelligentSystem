import { useState } from 'react';
import axios from 'axios';
import ImageUploader from '../common/ImageUploader';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MissingDocumentDetailPopup = ({ onClose, ...props }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    description: '',
    sightingPicture: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedMissingTime = props.missingTime 
    ? new Date(props.missingTime).toLocaleString() 
    : 'N/A';

  const formattedBirthday = props.birthday 
    ? new Date(props.birthday).toLocaleDateString() 
    : 'N/A';

  const formattedReportDate = props.reportDate 
    ? new Date(props.reportDate).toLocaleDateString() 
    : 'N/A';

  const genderDisplay = props.gender === true ? 'Male' : props.gender === false ? 'Female' : 'N/A';

  const areaString = props.missingArea 
    ? `${props.missingArea.commune || ''} ${props.missingArea.district || ''}, ${props.missingArea.province || ''}, ${props.missingArea.country || ''}`.trim()
    : 'N/A';

  // Define detail fields array for cleaner rendering
  const detailFields = [
    { label: 'Name', value: props.name || 'N/A', span: 1, bold: true },
    { label: 'Birthday', value: formattedBirthday, span: 1 },
    { label: 'Gender', value: genderDisplay, span: 1 },
    { label: 'Identity Card', value: props.identityCardNumber || 'N/A', span: 1 },
    { label: 'Height', value: props.height ? `${props.height} cm` : 'N/A', span: 1 },
    { label: 'Weight', value: props.weight ? `${props.weight} kg` : 'N/A', span: 1 },
    { label: 'Identifying Characteristic', value: props.identifyingCharacteristic || 'N/A', span: 2 },
    { label: 'Last Known Outfit', value: props.lastKnownOutfit || 'N/A', span: 2 },
    { label: 'Medical Conditions', value: props.medicalConditions || 'N/A', span: 2 },
    { label: 'Missing Time', value: formattedMissingTime, span: 1 },
    { label: 'Report Date', value: formattedReportDate, span: 1 },
    { label: 'Reporter Relationship', value: props.reporterRelationship || 'N/A', span: 1 },
    { label: 'Missing Area', value: areaString, span: 2 }
  ];

  const handleReportFound = () => {
    setShowReportForm(true);
  };

  const handleImageUpdate = (imageUrl) => {
    setReportData(prev => ({ ...prev, sightingPicture: imageUrl }));
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
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
      formData.append('missingDocumentId', props.id);
      formData.append('volunteerId', volunteerId);
      formData.append('description', reportData.description);
      formData.append('sightingPicture', reportData.sightingPicture);
      formData.append('sightingAreaId', props.missingArea?.id || '');

      const response = await axios.post(`${API_BASE}/api/missing-documents/submit-missing-person`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Report submitted successfully!');
        setShowReportForm(false);
        onClose();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(error.response?.data || 'An error occurred while submitting the report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center overflow-y-auto p-4" onClick={onClose}>
      <div 
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg md:max-w-2xl lg:max-w-4xl transform transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Missing Person Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {!showReportForm ? (
            <>
              <div className="mb-6">
                {props.image ? (
                  <img 
                    className="w-full h-64 md:h-80 object-cover rounded-lg border-2 border-gray-300 shadow-sm" 
                    src={props.image} 
                    alt={props.name || 'Missing Person'} 
                  />
                ) : (
                  <div className="w-full h-64 md:h-80 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                    <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">No Image Available</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 mb-6">
                {detailFields.map((field, index) => (
                  <div key={index} className={`bg-gray-50 p-3 rounded-lg ${field.span === 2 ? 'md:col-span-2' : ''}`}>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{field.label}</p>
                    <p className={`text-sm text-gray-900 mt-1 ${field.bold ? 'font-semibold' : ''}`}>
                      {field.value}
                    </p>
                  </div>
                ))}
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Case Status</p>
                  <p className="text-sm text-gray-900 mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      props.caseStatus === 'Missing' ? 'bg-red-100 text-red-800' :
                      props.caseStatus === 'Found' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {props.caseStatus || 'N/A'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {props.caseStatus !== 'Found' && (
                  <button
                    onClick={handleReportFound}
                    className="px-6 py-3 bg-orange-600 text-white text-base font-medium rounded-lg shadow-md hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Report Found
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 text-white text-base font-medium rounded-lg shadow-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Report Found Person</h4>
              
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

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MissingDocumentDetailPopup;
