import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons (reusable)
const createCustomIcon = (color, text) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${text.length > 1 ? '10px' : '12px'};
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${text}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const LocationsMissingList = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data only once on mount or when searchTerm changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/api/missing-documents/all`, {
          params: searchTerm ? { name: searchTerm } : {}
        });

        setItems(Array.isArray(res.data) ? res.data : (res.data.content || []));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(input.trim());
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [input]);

  const handleSearch = useCallback(() => {
    setSearchTerm(input.trim());
  }, [input]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="bg-cover bg-no-repeat w-screen overflow-x-hidden min-h-screen" 
         style={{ backgroundImage: "url('/footer-bg.png')" }}>
      {/* Small inline styles for custom marker and legend */}
      <style>
        {`
          .custom-marker { background: transparent !important; border: none !important; }
        `}
      </style>

      {/* Header */}
      <div className="font-sans font-bold text-center mt-24 mb-20 flex items-center justify-center">
        <div className="flex">
          <div className="text-4xl">Missing Persons Last Known Locations</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end mb-12 px-6">
        <div className="max-w-md w-full">
          <div className="flex items-center">
            <input 
              type="search" 
              placeholder="Search by name..." 
              name="search" 
              onChange={(e) => setInput(e.target.value)} 
              value={input}
              onKeyDown={handleKeyDown}
              className="flex-1 h-12 px-4 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={handleSearch}
              className="h-12 px-6 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600" />
            <span>Missing Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-600" />
            <span>Found Location</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container" style={{ height: '500px', width: '90%', margin: '0 auto 2rem auto', border: '1px solid #ccc', borderRadius: '8px' }}>
        <MapContainer 
          center={[16.0544, 108.2022]} 
          zoom={6} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
          />
          
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {/* Missing location marker */}
              {item.missingArea?.latitude && item.missingArea?.longitude ? (
                <Marker 
                  key={`missing-${item.id}`} 
                  position={[
                    parseFloat(item.missingArea.latitude),
                    parseFloat(item.missingArea.longitude)
                  ]}
                  icon={createCustomIcon('#dc2626', 'M')}
                >
                  <Popup>
                    <b>{item.name}</b>
                    <br />
                    Last seen: {item.missingArea.province}, {item.missingArea.country}
                  </Popup>
                </Marker>
              ) : null}

              {/* Found location marker: assume `foundArea` contains coordinates when case was found */}
              {item.foundArea?.latitude && item.foundArea?.longitude ? (
                <Marker 
                  key={`found-${item.id}`} 
                  position={[
                    parseFloat(item.foundArea.latitude),
                    parseFloat(item.foundArea.longitude)
                  ]}
                  icon={createCustomIcon('#16a34a', 'F')}
                >
                  <Popup>
                    <div>
                      <b>{item.name} (Found)</b>
                      <br />
                      Found at: {item.foundArea.province || item.foundArea.district || item.foundArea.commune}
                      <br />
                      Time: {item.foundTime ? new Date(item.foundTime).toLocaleString('vi-VN') : 'Unknown'}
                    </div>
                  </Popup>
                </Marker>
              ) : null}
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {/* Content List */}
      <div className="flex justify-center items-center flex-wrap pb-10">
        {loading ? (
          <div className="text-center p-8 text-lg text-gray-700">Loading...</div>
        ) : error ? (
          <div className="text-center p-8 text-lg text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center p-8 text-lg text-gray-700">No missing persons found.</div>
        ) : (
          items.map((element) => (
            // Reuse existing Missingcard component if available (same location in tree)
            <div key={element.id} className="m-2 w-full max-w-xl">
              <div className="p-4 border rounded-md bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-lg">{element.name}</div>
                    <div className="text-sm text-gray-600">ID: {element.id}</div>
                  </div>
                  <div className="text-sm text-gray-500">{element.status || ''}</div>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  {element.missingArea?.province && (
                    <div>Last seen: {element.missingArea.province}, {element.missingArea.country}</div>
                  )}
                  {element.foundArea?.province && (
                    <div className="text-green-600">Found at: {element.foundArea.province}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LocationsMissingList;
