import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageUploader from '../../common/ImageUploader';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MissingDocumentEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissingDocument();
  }, [id]);

  const fetchMissingDocument = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/missing-documents/${id}`);
      const data = response.data;
      // Map facePictureUrl to image for internal use
      setFormData({
        ...data,
        image: data.facePictureUrl
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      alert('Failed to load document data');
      navigate('/manage-reported-documents');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      const response = await axios.put(`${API_BASE}/api/missing-documents/${id}`, updateData);
      
      if (response.status === 200) {
        alert('Successfully updated missing person information.');
        navigate('/manage-reported-documents');
      }
    } catch (error) {
      console.error('Error updating missing person:', error);
      alert('An error occurred while updating the information.');
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
  const areaProvince = formData.missingArea?.province || '';
  const areaCountry = formData.missingArea?.country || '';

  const formFields = [
    { label: "Name", name: "name", type: "text", value: formData.name },
    { label: "Gender", name: "gender", type: "select", value: formData.gender, options: [
      { value: true, label: "Male" },
      { value: false, label: "Female" }
    ]},
    { label: "Identity Card", name: "identityCardNumber", type: "text", value: formData.identityCardNumber },
    { label: "Height (cm)", name: "height", type: "number", value: formData.height },
    { label: "Weight (kg)", name: "weight", type: "number", value: formData.weight },
    { label: "Characteristic", name: "identifyingCharacteristic", type: "textarea", value: formData.identifyingCharacteristic },
    { label: "Last Known Outfit", name: "lastKnownOutfit", type: "text", value: formData.lastKnownOutfit },
    { label: "Medical Conditions", name: "medicalConditions", type: "textarea", value: formData.medicalConditions },
    { label: "Missing Time", name: "missingTime", type: "datetime-local", value: formattedMissingTime },
    { label: "Relationship", name: "reporterRelationship", type: "text", value: formData.reporterRelationship },
    { label: "Case Status", name: "caseStatus", type: "text", value: formData.caseStatus },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Missing Person Information</h1>
            <button
              onClick={() => navigate('/manage-reported-documents')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to List
            </button>
          </div>
          
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
                <div key={field.name} className="col-span-1">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows="4"
                      value={field.value || ''}
                      onChange={handleChange}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              ))}
              
              <div className="col-span-1">
                <label htmlFor="missingAreaProvince" className="block text-sm font-medium text-gray-700 mb-2">
                  Missing Area - Province
                </label>
                <input
                  type="text"
                  name="missingAreaProvince"
                  id="missingAreaProvince"
                  value={areaProvince}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    missingArea: { ...prev.missingArea, province: e.target.value } 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="missingAreaCountry" className="block text-sm font-medium text-gray-700 mb-2">
                  Missing Area - Country
                </label>
                <input
                  type="text"
                  name="missingAreaCountry"
                  id="missingAreaCountry"
                  value={areaCountry}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    missingArea: { ...prev.missingArea, country: e.target.value } 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/manage-reported-documents')}
                className="px-6 py-3 text-base font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-md shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MissingDocumentEditPage;
