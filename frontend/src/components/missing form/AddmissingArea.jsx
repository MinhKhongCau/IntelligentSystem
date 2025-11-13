import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../../contexts/AuthContext';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// A component to handle map clicks with reverse geocoding
function MapClickHandler({ setPosition, setForm }) {
  const map = useMapEvents({
    async click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&addressdetails=1`
        );
        const data = await response.json();
        
        if (data && data.address) {
          const address = data.address;
          
          setForm(prev => ({
            ...prev,
            commune: address.suburb || address.neighbourhood || address.hamlet || prev.commune,
            district: address.city_district || address.county || address.state_district || prev.district || address.city,
            province: address.state || address.province || address.region || prev.province || address.military || data.name,
            country: address.country || prev.country
          }));
        }
      } catch (error) {
        console.error('Error with reverse geocoding:', error);
      }
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
  const [position, setPosition] = useState(null);
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
      const res = await axios.post(`${API_BASE}/api/areas/add`, areaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 201) {
        onAreaAdded(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex gap-5 p-10 max-w-7xl mx-auto my-5 bg-white rounded-lg shadow-lg relative">
      <button 
        type="button" 
        className="absolute top-0 right-0 m-4 m bg-transparent border-none text-4xl leading-none text-gray-600 cursor-pointer font-light hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <form onSubmit={handleSubmit} className="flex-none min-w-[300px] w-[10rem]">
        <h2 className="text-2xl font-medium mb-5">Add New Surveillance Area</h2>
        
        {error && (
          <div className="text-red-600 bg-red-100 p-4 border border-red-600 p-2.5 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <span className="block font-medium mb-1">Commune / Ward</span>
          <input
            type="text"
            value={form.commune}
            onChange={(e) => setForm({ ...form, commune: e.target.value })}
            placeholder="e.g., Bến Nghé"
            className="h-11 w-full outline-none rounded border border-gray-300 py-2 px-4 text-base border-b-2 transition-all focus:border-purple-600"
          />
        </div>

        <div className="mb-4">
          <span className="block font-medium mb-1">District</span>
          <input
            type="text"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            placeholder="e.g., District 1"
            className="h-11 w-full outline-none rounded border border-gray-300 py-2 px-4 text-base border-b-2 transition-all focus:border-purple-600"
          />
        </div>

        <div className="mb-4">
          <span className="block font-medium mb-1">Province / City</span>
          <input
            type="text"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
            placeholder="e.g., Ho Chi Minh City"
            required
            className="h-11 w-full outline-none rounded border border-gray-300 p-4 text-base border-b-2 transition-all focus:border-purple-600"
          />
        </div>

        <div className="mb-4">
          <span className="block font-medium mb-1">Country</span>
          <input
            type="text"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            placeholder="e.g., Vietnam"
            required
            className="h-11 w-full outline-none rounded border border-gray-300 py-2 px-4 text-base border-b-2 transition-all focus:border-purple-600"
          />
        </div>

        <div className="mb-4">
          <span className="block font-medium mb-1">Select Location on Map</span>
          {position && (
            <p className="text-sm text-gray-600">
              Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
            </p>
          )}
        </div>

        <div className="h-11 mt-6">
          <button 
            type="submit" 
            disabled={submitting}
            className="h-full w-full outline-none text-white border-nonen py-2 px-4 text-lg font-medium rounded tracking-wide bg-gradient-to-br from-blue-400 to-purple-600 cursor-pointer transition-all hover:bg-gradient-to-bl disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving...' : 'Save Area'}
          </button>
        </div>
      </form>

      <div 
      className="map-container" 
      style={{ height: '500px', width: '90%', margin: '0 auto 2rem auto', border: '1px solid #ccc', borderRadius: '8px' }}>
        <MapContainer
          center={[10.7769, 106.7009]}
          zoom={13}
          className="w-full h-full rounded-lg"
          style={{ height: '100%', minHeight: '450px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler setPosition={setPosition} setForm={setForm} />

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
