import React, { useEffect, useState } from 'react';
import Missingcard from './Missingcard';
import './MissingList.css';
import './Searchcss.css';
import locationimg from './Locationnew.png';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MissingList = () => {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');

  const getdata = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/foundlocation/getalllocations`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setItems([]);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  const handleSearch = () => setQuery(input.trim());

  const filtered = items.filter((el) => {
    if (!query) return true;
    return String(el.adhaar_number || el.adhaar || '').includes(query);
  });

  return (
    <div className="missingloc">
      <div className="headerlist text-4xl">
        <div className="subheadinglist">
          <div>Tracked Locations</div>
          <img src={locationimg} alt="" width="50" />
        </div>
      </div>

      <div className="input-group">
        <div>
          <div className="search-bar">
            <input type="search" placeholder="search location by adhaar" name="search" onChange={(e) => setInput(e.target.value)} value={input} />
            <button className="search-btn" onClick={handleSearch} />
          </div>
        </div>
      </div>

      <div className="contentlist">
        {filtered.length === 0 ? (
          <div className="no-data">No locations found</div>
        ) : (
          filtered.map((element) => (
            <Missingcard
              key={`${element.adhaar_number}_${element.date}`}
              name={element.name}
              adhaar={element.adhaar_number}
              date={element.date}
              region={element.location?.region}
              latitude={element.location?.latitude}
              longitude={element.location?.longitude}
              country={element.location?.country}
              state={element.location?.city}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MissingList;