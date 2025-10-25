import React, { useState } from 'react';
import './formmissing.css';
import axios from 'axios';
import formimage from '../../images/form.gif';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Formmissing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    datemissing: '',
    identification: '',
    adhaar_number: '',
    address: '',
    height: '',
    phonenumber: '',
    Gender: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleinput = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files && files[0];
      setImage(file);
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const postdata = async (e) => {
    e.preventDefault();
    setError('');
    if (!user.name || !user.adhaar_number || !user.datemissing) {
      setError('Please fill required fields: name, adhaar number, date missing.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(user).forEach(([k, v]) => formData.append(k, v ?? ''));
      if (image) formData.append('image', image);

      const res = await axios.post(`${API_BASE}/api/missingpeople/addperson`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.status === 200 || res.status === 201) {
        // navigate back to list or dashboard
        navigate('/Missing_persons', { replace: true });
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fullformpage">
      <div className="formout">
        <div className="containerform">
          <div className="title">Registration</div>
          <div className="content">
            <form onSubmit={postdata}>
              {error && <div className="error-message">{error}</div>}
              <div className="user-details">
                <div className="input-box">
                  <span className="details">Full Name</span>
                  <input type="text" name="name" value={user.name} onChange={handleinput} required />
                </div>
                <div className="input-box">
                  <span className="details">Email</span>
                  <input type="email" name="email" value={user.email} onChange={handleinput} />
                </div>
                <div className="input-box">
                  <span className="details">Date missing</span>
                  <input type="date" name="datemissing" value={user.datemissing} onChange={handleinput} required />
                </div>
                <div className="input-box">
                  <span className="details">Identification</span>
                  <input type="text" name="identification" value={user.identification} onChange={handleinput} />
                </div>
                <div className="input-box">
                  <span className="details">Adhaar number</span>
                  <input type="text" name="adhaar_number" value={user.adhaar_number} onChange={handleinput} required />
                </div>
                <div className="input-box">
                  <span className="details">Address</span>
                  <input type="text" name="address" value={user.address} onChange={handleinput} />
                </div>
                <div className="input-box">
                  <span className="details">Height</span>
                  <input type="number" name="height" value={user.height} onChange={handleinput} />
                </div>
                <div className="input-box">
                  <span className="details">Phone number</span>
                  <input type="tel" name="phonenumber" value={user.phonenumber} onChange={handleinput} />
                </div>

                <div className="input-box">
                  <span className="details">Person image</span>
                  <input type="file" name="image" accept="image/*" onChange={handleinput} />
                  {preview && <img src={preview} alt="preview" style={{ maxWidth: 120, marginTop: 8 }} />}
                </div>
              </div>

              <div className="gender-details">
                <span className="gender-title">Gender</span>
                <div className="category">
                  <label htmlFor="dot-1">
                    <input type="radio" name="Gender" id="dot-1" value="male" onChange={handleinput} />
                    {/* <span className="dot one"></span> */}
                    <span className="gender">Male</span>
                  </label>
                  <label htmlFor="dot-2">
                    {/* <span className="dot two"></span> */}
                    <input type="radio" name="Gender" id="dot-2" value="female" onChange={handleinput} />
                    <span className="gender">Female</span>
                  </label>
                  <label htmlFor="dot-3">
                    {/* <span className="dot three"></span> */}
                    <input type="radio" name="Gender" id="dot-3" value="others" onChange={handleinput} />
                    <span className="gender">Others</span>
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

      <div className="photoform">
        <div className="textphoto">
          Get the missing person Registered with us and get him found with our face recognition methods
        </div>
        <img src={formimage} alt="form visual" width="400" />
      </div>
    </div>
  );
};

export default Formmissing;