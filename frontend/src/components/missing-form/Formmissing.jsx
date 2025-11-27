import React, { useState, useEffect } from 'react';
import axios from 'axios';
import formimage from '../../images/form.gif';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AddMissingArea from './AddmissingArea';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Formmissing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    birthday: '',
    gender: 'male',
    identityCardNumber: '',
    height: '',
    weight: '',
    identifyingCharacteristic: '',
    lastKnownOutfit: '',
    medicalConditions: '',
    facePictureUrl: '',
    missingTime: '',
    reporterRelationship: '',
    reporterId: user.id || '',
    missingAreaId: '',
  });
  const [areas, setAreas] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/areas`);
        setAreas(res.data);
        if (res.data.length > 0) {
          setForm((prev) => ({ ...prev, missingAreaId: res.data[0].id }));
        }
      } catch (err) {
        console.error("Failed to fetch areas", err);
      }
    };
    fetchAreas();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files && files[0];
      setImageFile(file);
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAreaAdded = (newArea) => {
    setAreas(prevAreas => [...prevAreas, newArea]);
    setForm(prevForm => ({ ...prevForm, missingAreaId: newArea.id }));
    setIsAreaModalOpen(false);
  };

  const postdata = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name?.trim()) {
      setError('Name is required');
      return;
    }
    if (!form.missingTime) {
      setError('Missing time is required');
      return;
    }
    if (!form.reporterId) {
      setError('Reporter id is required');
      return;
    }
    if (!imageFile && !form.facePictureUrl) {
      setError('Face picture (file or URL) is required');
      return;
    }

    setSubmitting(true);

    let finalFacePictureUrl = form.facePictureUrl;

    try {
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const imageRes = await axios.post(`${API_BASE}/api/upload/image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (imageRes.data || imageRes.data.url) {
          finalFacePictureUrl = imageRes.data?.url || imageRes.data;
        } else {
          throw new Error('Image upload succeeded but did not return a URL.');
        }
      }

      const submissionData = {
        ...form,
        facePictureUrl: finalFacePictureUrl,
        gender: form.gender === 'female',
      };

      console.log('Submitting JSON data:', submissionData);

      const res = await axios.post(`${API_BASE}/api/missing-documents`, submissionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200 || res.status === 201) {
        navigate('/missingpeople', { replace: true });
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen py-10 px-4 mx-24">
      <div className="flex flex-col lg:flex-row items-start justify-center gap-10 w-full max-w-7xl mx-auto">
        {/* Form Section */}
        <div className="w-3/4 lg:w-auto flex-1">
          <div className="max-w-3xl w-full bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl md:text-4xl font-medium mb-6 relative pb-2 before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-1 before:w-8 before:rounded before:bg-gradient-to-r before:from-blue-400 before:to-purple-600">
              Report Missing Person
            </h2>
            
            <form onSubmit={postdata} encType="multipart/form-data">
              {error && (
                <div className="text-red-600 bg-red-50 border border-red-600 p-2.5 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap justify-between gap-y-4 my-5">
                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Full Name</span>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Birthday</span>
                  <input 
                    type="date" 
                    name="birthday" 
                    value={form.birthday} 
                    onChange={handleChange}
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Missing time</span>
                  <input
                    type="datetime-local"
                    name="missingTime"
                    value={form.missingTime}
                    onChange={handleChange}
                    required
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Identity Card Number</span>
                  <input 
                    type="text" 
                    name="identityCardNumber" 
                    value={form.identityCardNumber} 
                    onChange={handleChange}
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Height</span>
                  <input 
                    type="number" 
                    name="height" 
                    value={form.height} 
                    onChange={handleChange}
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Weight</span>
                  <input 
                    type="number" 
                    name="weight" 
                    value={form.weight} 
                    onChange={handleChange}
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Identifying Characteristic</span>
                  <input
                    type="text"
                    name="identifyingCharacteristic"
                    value={form.identifyingCharacteristic}
                    onChange={handleChange}
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Last Known Outfit</span>
                  <input 
                    type="text" 
                    name="lastKnownOutfit" 
                    value={form.lastKnownOutfit} 
                    onChange={handleChange}
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Medical Conditions</span>
                  <input 
                    type="text" 
                    name="medicalConditions" 
                    value={form.medicalConditions} 
                    onChange={handleChange}
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Face picture (URL or file)</span>
                  <div className="mt-2">
                    <input 
                      type="file" 
                      name="image" 
                      accept="image/*" 
                      onChange={handleChange}
                      className="text-sm"
                    />
                    {preview && (
                      <img 
                        src={preview} 
                        alt="preview" 
                        className="max-w-[120px] mt-2 rounded border border-gray-300"
                      />
                    )}
                  </div>
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Reporter relationship</span>
                  <input 
                    type="text" 
                    name="reporterRelationship" 
                    value={form.reporterRelationship} 
                    onChange={handleChange}
                    className="h-11 w-full outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                  />
                </div>

                <div className="w-full md:w-[calc(50%-10px)]">
                  <span className="block font-medium mb-1">Missing Area</span>
                  <div className="flex gap-2">
                    <select 
                      name="missingAreaId" 
                      value={form.missingAreaId} 
                      onChange={handleChange} 
                      required
                      className="flex-1 h-11 outline-none text-base rounded px-4 py-2 border border-gray-300 border-b-2 transition-all focus:border-purple-600"
                    >
                      <option value="" disabled>Select an area</option>
                      {areas.map(area => (
                        <option key={area.id} value={area.id}>
                          {`${area.commune || ''}${area.commune ? ', ' : ''}${area.district || ''}${area.district ? ', ' : ''}${area.province}`}
                        </option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
                      onClick={() => setIsAreaModalOpen(true)}
                    >
                      + New
                    </button>
                  </div>
                </div>
              </div>

              <div className="my-4 py-2">
                <span className="text-lg font-medium">Gender</span>
                <div className="flex gap-8 my-3">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="male" 
                      checked={form.gender === 'male'} 
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" 
                      name="gender" 
                      value="female" 
                      checked={form.gender === 'female'} 
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="h-11 mt-8">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="h-full w-full px-4 py-2 rounded border-none text-white text-lg font-medium tracking-wide cursor-pointer hover:shadow transition-all bg-gradient-to-r from-idigo-500 to-purple-600"
                >
                  {submitting ? 'Reporting...' : 'Report'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex flex-col items-center lg:items-start gap-6 w-full lg:w-auto">
          <div className="text-center lg:text-left max-w-md text-lg text-gray-700">
            Get the missing person Registered with us and get them found with our face recognition methods
          </div>
          <img 
            src={formimage} 
            alt="form visual" 
            className="w-full max-w-md rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Modal */}
      {isAreaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[1000]">
          <div className="relative bg-white p-5 rounded-lg w-5/6 max-w-7xl max-h-[90vh] overflow-y-auto">
            <AddMissingArea 
              onAreaAdded={handleAreaAdded}
              onClose={() => setIsAreaModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Formmissing;
