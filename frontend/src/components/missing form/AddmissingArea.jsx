import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Import L for custom icons
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../contexts/AuthContext'; // For the token
import './AddMissingArea.css'; // We will create this CSS file

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// A component to handle map clicks
function MapClickHandler({ setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng); // Set the state with new coordinates
      map.flyTo(e.latlng, map.getZoom()); // Move map to clicked spot
    },
  });
  return null;
}

const AddMissingArea = ({ onAreaAdded, onClose }) => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    commune: '',
    district: '',
    province: '',
    country: '',
  });
  const [position, setPosition] = useState(null); // Will hold { lat: number, lng: number }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.province.trim()) {
      setError('Province is required.');
      return;
    }
    if (!form.country.trim()) {
      setError('Country is required.');
      return;
    }
    if (!position) {
      setError('Please select a location on the map.');
      return;
    }
    if (!token) {
      setError('You must be logged in.');
      return;
    }

    setSubmitting(true);

    const areaData = {
      ...form,
      latitude: position.lat,
      longitude: position.lng,
    };

    console.log('Submitting Area Data:', areaData);

    try {
      // !! IMPORTANT: You need to create this backend endpoint !!
      const res = await axios.post(`${API_BASE}/api/areas/add`, areaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Sending JSON now, not FormData
        },
      });

      if (res.status === 201) {
        // Pass the new area data back to the parent and close
        onAreaAdded(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-area-container">
      <button type="button" className="close-button" onClick={onClose}>&times;</button>
      <form onSubmit={handleSubmit} className="area-form">
        <h2>Add New Surveillance Area</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="input-box">
          <span className="details">Commune / Ward</span>
          <input
            type="text"
            value={form.commune}
            onChange={(e) => setForm({ ...form, commune: e.target.value })}
            placeholder="e.g., Bến Nghé"
          />
        </div>
        <div className="input-box">
          <span className="details">District</span>
          <input
            type="text"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            placeholder="e.g., District 1"
          />
        </div>
        <div className="input-box">
          <span className="details">Province / City</span>
          <input
            type="text"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
            placeholder="e.g., Ho Chi Minh City"
            required
          />
        </div>
        <div className="input-box">
          <span className="details">Country</span>
          <input
            type="text"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            placeholder="e.g., Vietnam"
            required
          />
        </div>

        <div className="input-box">
          <span className="details">Select Location on Map</span>
          {position && (
            <p>
              Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
            </p>
          )}
        </div>

        <div className="button">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Area'}
          </button>
        </div>
      </form>

      <div className="map-wrapper">
        <MapContainer
          center={[10.7769, 106.7009]} // Default center (e.g., Ho Chi Minh City)
          zoom={13}
          className="leaflet-map"
        >
          {/* This part provides the map "theme" (the visual tiles) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler setPosition={setPosition} />

          {position && (
            <Marker position={position}>
              <Popup>Selected Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default AddMissingArea;