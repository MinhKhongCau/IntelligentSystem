import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Missingcard from './Missingcard';
import './MissingList.css';
import './Searchcss.css';
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

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MissingList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/missing-documents`);
        // A successful GET request typically returns 200 OK, not 201 Created.
        if (res.status === 200) {
          const data = res.data; // Declare data with const
          setItems(Array.isArray(data) ? data : []);
          setFilteredItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setItems([]);
        setFilteredItems([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = items.filter((el) => {
      if (!query) return true;
      return (el.fullName || '').toLowerCase().includes(query.toLowerCase());
    });
    setFilteredItems(filtered);
  }, [query, items]);

  const handleSearch = () => setQuery(input.trim());

  return (
    <div className="missingloc">
      <div className="headerlist text-4xl">
        <div className="subheadinglist">
          <div>Missing Persons Last Known Locations</div>
        </div>
      </div>

      <div className="input-group">
        <div>
          <div className="search-bar">
            <input type="search" placeholder="Search by name..." name="search" onChange={(e) => setInput(e.target.value)} value={input} />
            <button className="search-btn" onClick={handleSearch} />
          </div>
        </div>
      </div>

      <div className="map-container" style={{ height: '500px', width: '90%', margin: '0 auto 2rem auto', border: '1px solid #ccc', borderRadius: '8px' }}>
        <MapContainer center={[10.7769, 106.7009]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          {filteredItems.map((item) =>
            item.missingArea?.latitude && item.missingArea?.longitude ? (
              <Marker key={item.id} position={[item.missingArea.latitude, item.missingArea.longitude]}>
                <Popup>
                  <b>{item.fullName}</b>
                  <br />
                  Last seen: {item.missingArea.province}, {item.missingArea.country}
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      <div className="contentlist">
        {filteredItems.length === 0 ? (
          <div className="no-data">No missing persons found.</div>
        ) : (
          filteredItems.map((element) => (
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