import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MissingDocumentEditPopup = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {});
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setUploadError('');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', selectedFile);

      // Upload image to backend
      const response = await axios.post(`${API_BASE}/api/upload/image`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response)

      // Backend returns the image URL (relative path like "/uploads/filename.jpg")
      const imageUrl = response.data.url || response.data.imageUrl || response.data;
      
      if (imageUrl) {
        // Store the relative path (will be converted to full URL when displaying)
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
        setIsEditingImage(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        setUploadError('Failed to get image URL from server', response.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelImageEdit = () => {
    setIsEditingImage(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Extract just the path from the full URL if it contains API_BASE
    let imageUrl = formData.image;
    if (imageUrl && imageUrl.startsWith(API_BASE)) {
      imageUrl = imageUrl.replace(API_BASE, '');
    }
    
    // Prepare data for PUT request matching MissingDocumentRequest DTO
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
      reporterId: formData.reporter,
      caseStatus: formData.caseStatus
    };

    onSave(updateData);
    onClose();
  };
  
  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const datePart = date.toISOString().split('T')[0]; 
    const timePart = date.toTimeString().split(' ')[0].substring(0, 5); 
    return `${datePart}T${timePart}`;
  };
  
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 overflow-y-auto p-4" onClick={onClose}>
      <div className="min-h-screen flex items-end justify-center pb-20 pt-4 px-4 sm:p-0">
        <div 
          className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl transform transition-all duration-300 scale-100 my-8"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Chỉnh Sửa Thông Tin Người Mất Tích</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Person Image</label>
                {!isEditingImage && (
                  <button
                    type="button"
                    onClick={() => setIsEditingImage(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Image
                  </button>
                )}
              </div>
              
              {!isEditingImage ? (
                <div className="relative group">
                  {formData.image ? (
                    <img 
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-300 shadow-sm" 
                      src={formData.image.startsWith('http') ? formData.image : `${API_BASE}${formData.image}`}
                      alt="Missing Person" 
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                      <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No Image Available</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Upload Area */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50 hover:bg-blue-100 transition-colors">
                    <input
                      type="file"
                      id="imageFile"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="imageFile"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <svg className="w-12 h-12 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-700">{uploadError}</p>
                    </div>
                  )}

                  {/* Preview and Upload Button */}
                  {selectedFile && previewUrl && (
                    <div className="space-y-3">
                      <div className="relative">
                        <p className="text-xs text-gray-600 mb-2 font-medium">Preview:</p>
                        <img 
                          className="w-full h-48 object-cover rounded-lg border-2 border-blue-300 shadow-sm" 
                          src={previewUrl} 
                          alt="Preview" 
                        />
                        <div className="mt-2 text-xs text-gray-500">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleImageUpload}
                          disabled={isUploading}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                        >
                          {isUploading ? (
                            <>
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              Upload Image
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelImageEdit}
                          disabled={isUploading}
                          className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cancel button when no file selected */}
                  {!selectedFile && (
                    <button
                      type="button"
                      onClick={handleCancelImageEdit}
                      className="w-full px-4 py-2 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
              {formFields.map((field) => (
                <div key={field.name} className="col-span-1">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows="3"
                      value={field.value || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  )}
                </div>
              ))}
              
              <div className="col-span-1">
                <label htmlFor="missingAreaProvince" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="missingAreaCountry" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-base font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MissingDocumentEditPopup;