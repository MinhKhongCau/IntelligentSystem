import React, { useState, useEffect } from 'react';
import './formmissing.css';
import axios from 'axios';
import formimage from '../../images/form.gif';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AddMissingArea from './AddmissingArea'; // Import the component

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Formmissing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    birthday: '', // yyyy-MM-dd
    gender: 'male', // 'male' | 'female' 
    identityCardNumber: '',
    height: '',
    weight: '',
    identifyingCharacteristic: '',
    lastKnownOutfit: '',
    medicalConditions: '',
    facePictureUrl: '', // optional URL
    missingTime: '', // yyyy-MM-ddTHH:mm
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
          // Set default selected area
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
    // Add the new area to the dropdown list
    setAreas(prevAreas => [...prevAreas, newArea]);
    // Automatically select the new area in the form
    setForm(prevForm => ({ ...prevForm, missingAreaId: newArea.id }));
    // Close the modal
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
      // Step 1: If there's an image file, upload it first to get a URL.
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const imageRes = await axios.post(`${API_BASE}/api/upload/image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (imageRes.data && imageRes.data.url) {
          finalFacePictureUrl = imageRes.data.url;
        } else {
          throw new Error('Image upload succeeded but did not return a URL.');
        }
      }

      // Step 2: Prepare the final JSON payload.
      const submissionData = {
        ...form,
        facePictureUrl: finalFacePictureUrl,
        gender: form.gender === 'female', // Convert to boolean: female -> true, male -> false
      };

      console.log('Submitting JSON data:', submissionData);

      // Step 3: Post the JSON data to the create endpoint.
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
    <div className="fullformpage">
      <div className="formout">
        <div className="containerform">
          <h2 className="title">Report Missing Person</h2>
          <div className="content">
            <form onSubmit={postdata} encType="multipart/form-data">
              {error && <div className="error-message">{error}</div>}
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Full Name</span>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div className="input-box">
                  <span className="details">Birthday</span>
                  <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
                </div>

                <div className="input-box">
                  <span className="details">Missing time</span>
                  <input
                    type="datetime-local"
                    name="missingTime"
                    value={form.missingTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-box">
                  <span className="details">Identity Card Number</span>
                  <input type="text" name="identityCardNumber" value={form.identityCardNumber} onChange={handleChange} />
                </div>

                <div className="input-box">
                  <span className="details">Height</span>
                  <input type="number" name="height" value={form.height} onChange={handleChange} />
                </div>

                <div className="input-box">
                  <span className="details">Weight</span>
                  <input type="number" name="weight" value={form.weight} onChange={handleChange} />
                </div>

                <div className="input-box">
                  <span className="details">Identifying Characteristic</span>
                  <input
                    type="text"
                    name="identifyingCharacteristic"
                    value={form.identifyingCharacteristic}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-box">
                  <span className="details">Last Known Outfit</span>
                  <input type="text" name="lastKnownOutfit" value={form.lastKnownOutfit} onChange={handleChange} />
                </div>

                <div className="input-box">
                  <span className="details">Medical Conditions</span>
                  <input type="text" name="medicalConditions" value={form.medicalConditions} onChange={handleChange} />
                </div>

                <div className="input-box">
                  <span className="details">Face picture (URL or file)</span>
                  <div style={{ marginTop: 8 }}>
                    <input type="file" name="image" accept="image/*" onChange={handleChange} />
                    {preview && <img src={preview} alt="preview" style={{ maxWidth: 120, marginTop: 8 }} />}
                  </div>
                </div>

                <div className="input-box">
                  <span className="details">Reporter relationship</span>
                  <input type="text" name="reporterRelationship" value={form.reporterRelationship} onChange={handleChange} />
                </div>

                <div className="input-box">
                  <span className="details">Missing Area</span>
                  <div className="area-selection-wrapper">
                    <select 
                      name="missingAreaId" 
                      value={form.missingAreaId} 
                      onChange={handleChange} 
                      required
                      className="area-select"
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
                      className="add-area-btn" 
                      onClick={() => setIsAreaModalOpen(true)}>
                      + New
                    </button>
                  </div>
                </div>

              </div>

              <div className="gender-details">
                <span className="gender-title">Gender</span>
                <div className="category">
                  <label>
                    <input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={handleChange} /> Male
                  </label>
                  <label>
                    <input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={handleChange} /> Female
                  </label>
                </div>
              </div>

              <div className="button">
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Reporting...' : 'Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {isAreaModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddMissingArea 
              onAreaAdded={handleAreaAdded}
              onClose={() => setIsAreaModalOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="photoform">
        <div className="textphoto">
          Get the missing person Registered with us and get them found with our face recognition methods
        </div>
        <img src={formimage} alt="form visual" width="400" />
      </div>
    </div>
  );
};

export default Formmissing;