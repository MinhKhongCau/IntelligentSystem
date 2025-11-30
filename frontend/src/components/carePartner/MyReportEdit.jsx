import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageUploader from '../common/ImageUploader';
import AddMissingArea from '../missing-form/AddmissingArea';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MyReportEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddArea, setShowAddArea] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMissingDocument();
  }, [id]);

  const fetchMissingDocument = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/missing-documents/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = response.data;
      setFormData({
        ...data,
        image: data.facePictureUrl
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      alert('Failed to load document data');
      navigate('/my-reports');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageUpdate = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleAreaAdded = (newArea) => {
    setFormData(prev => ({
      ...prev,
      missingArea: newArea
    }));
    setShowAddArea(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let imageUrl = formData.image;
    if (imageUrl && imageUrl.startsWith(API_BASE)) {
      imageUrl = imageUrl.replace(API_BASE, '');
    }
    
    const updateData = {
      id: formData.id,
      name: formData.name,
      birthday: formData.birthday,
      gender: formData.gender,
      identityCardNumber: formData.identityCardNumber,
      height: formData.height ? String(formData.height) : null,
      weight: formData.weight ? String(formData.weight) : null,
      identifyingCharacteristic: formData.identifyingCharacteristic,
      lastKnownOutfit: formData.lastKnownOutfit,
      medicalConditions: formData.medicalConditions,
      facePictureUrl: imageUrl,
      missingTime: formData.missingTime,
      reportDate: formData.reportDate,
      reporterRelationship: formData.reporterRelationship,
      missingAreaId: formData.missingArea?.id,
      reporterId: formData.reporterId,
      caseStatus: formData.caseStatus
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE}/api/missing-documents/${id}`, updateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 200) {
        alert('Successfully updated missing person information.');
        navigate('/my-reports');
      }
    } catch (error) {
      console.error('Error updating missing person:', error);
      alert('An error occurred while updating the information.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const datePart = date.toISOString().split('T')[0]; 
    const timePart = date.toTimeString().split(' ')[0].substring(0, 5); 
    return `${datePart}T${timePart}`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const formattedMissingTime = formatDateTimeLocal(formData.missingTime);
  const formattedBirthday = formatDateTimeLocal(formData.birthday);

  const formFields = [
    { label: "Name", name: "name", type: "text", value: formData.name, required: true },
    { label: "Gender", name: "gender", type: "select", value: formData.gender, options: [
      { value: true, label: "Male" },
      { value: false, label: "Female" }
    ]},
    { label: "Birthday", name: "birthday", type: "datetime-local", value: formattedBirthday },
    { label: "Identity Card", name: "identityCardNumber", type: "text", value: formData.identityCardNumber },
    { label: "Height (cm)", name: "height", type: "number", value: formData.height },
    { label: "Weight (kg)", name: "weight", type: "number", value: formData.weight },
    { label: "Identifying Characteristic", name: "identifyingCharacteristic", type: "textarea", value: formData.identifyingCharacteristic },
    { label: "Last Known Outfit", name: "lastKnownOutfit", type: "text", value: formData.lastKnownOutfit },
    { label: "Medical Conditions", name: "medicalConditions", type: "textarea", value: formData.medicalConditions },
    { label: "Missing Time", name: "missingTime", type: "datetime-local", value: formattedMissingTime, required: true },
    { label: "Relationship to Missing Person", name: "reporterRelationship", type: "text", value: formData.reporterRelationship },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Missing Person Report</h1>
            <button
              onClick={() => navigate('/my-reports')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to My Reports
            </button>
          </div>
          
          {showAddArea ? (
            <div className="mb-8">
              <AddMissingArea 
                onAreaAdded={handleAreaAdded}
                onClose={() => setShowAddArea(false)}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Image Section */}
              <ImageUploader 
                currentImage={formData.image}
                onImageUpdate={handleImageUpdate}
                className="mb-8"
              />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {formFields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : 'col-span-1'}>
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows="4"
                        value={field.value || ''}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      ></textarea>
                    ) : field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.value === true ? 'true' : field.value === false ? 'false' : ''}
                        onChange={(e) => {
                          const value = e.target.value === 'true' ? true : e.target.value === 'false' ? false : null;
                          setFormData(prev => ({ ...prev, [field.name]: value }));
                        }}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Gender</option>
                        {field.options?.map(opt => (
                          <option key={opt.value.toString()} value={opt.value.toString()}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        id={field.name}
                        value={field.value || ''}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Missing Area Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Missing Area <span className="text-red-500">*</span>
                </label>
                {formData.missingArea ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <p className="text-sm text-gray-900 mb-2">
                      {formData.missingArea.commune && `${formData.missingArea.commune}, `}
                      {formData.missingArea.district && `${formData.missingArea.district}, `}
                      {formData.missingArea.province}, {formData.missingArea.country}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddArea(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change Location
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddArea(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Missing Area
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/my-reports')}
                  className="px-6 py-3 text-base font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-md shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReportEdit;
