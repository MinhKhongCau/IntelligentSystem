import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Missingcard from './Missingcard'; 
import './MissingList.css'; 
import './Searchcss.css'; 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MissingList = () => {
  const [items, setItems] = useState([]); 
  const [query, setQuery] = useState(''); 
  const [input, setInput] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/api/missing-documents`, {
          params: {
            name: query // Sử dụng 'query' để lọc ở backend
          }
        });
        
        setItems(Array.isArray(res.data) ? res.data : []);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]); 

  // Press Search buttong handler
  const handleSearch = () => setQuery(input.trim());

  return (
    <div className="missingloc">
      <div className="headerlist text-4xl">
        <div className="subheadinglist">
          <div>Missing Persons Last Known Locations</div>
        </div>
      </div>

      {/* Searching */}
      <div className="input-group">
        <div>
          <div className="search-bar">
            <input 
              type="search" 
              placeholder="Search by name..." 
              name="search" 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
            />
            <button className="search-btn" onClick={handleSearch} />
          </div>
        </div>
      </div>

      {/* Leaflet map */}
      <div className="map-container" style={{ height: '500px', width: '90%', margin: '0 auto 2rem auto', border: '1px solid #ccc', borderRadius: '8px' }}>
        <MapContainer center={[16.0544, 108.2022]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          
          {items.map((item) =>
            // Kiểm tra latitude/longitude (kiểu BigDecimal từ DTO)
            item.missingArea?.latitude && item.missingArea?.longitude ? (
              <Marker 
                key={item.id} 
                position={[
                  parseFloat(item.missingArea.latitude),
                  parseFloat(item.missingArea.longitude) 
                ]}
              >
                <Popup>
                  <b>{item.name}</b> 
                  <br />
                  Last seen: {item.missingArea.province}, {item.missingArea.country}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      {/* List of Missing Card */}
      <div className="contentlist">
        {loading ? (
          <div className="no-data" style={{textAlign: 'center', padding: '2rem'}}>Loading...</div>
        ) : error ? (
          <div className="no-data" style={{textAlign: 'center', padding: '2rem', color: 'red'}}>{error}</div>
        ) : items.length === 0 ? (
          <div className="no-data">No missing persons found.</div>
        ) : (
          items.map((element) => (
            <Missingcard
              key={element.id}
              document={element} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MissingList;