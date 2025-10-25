import React, { useEffect, useState, useCallback } from 'react';
import missingimg from './missingguy.png';
import './Missing_persons.css';
import PersonCard from './PersonCard';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Missing_persons = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getdata = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/missingpeople/getallpersons`);
      const data = await res.json();
      setCases(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load cases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getdata();
  }, [getdata]);

  // remove deleted id from state
  const handleDeleted = (adhaarId) => {
    setCases((prev) => prev.filter((c) => c.adhaar_number !== adhaarId));
  };

  function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  }

  return (
    <div className="personwhole" style={{ backgroundColor: '#f1f1f1' }}>
      <div className="personheader">
        <div className="subheadingmissing">
          <div className="text-4xl">Missing People</div>
          <img src={missingimg} alt="" width="70" />
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      <div className="contentlist">
        {cases.map((element) => {
          const base64string = arrayBufferToBase64(element.image.data.data);
          const src = `data:image/png;base64,${base64string}`;
          return (
            <PersonCard
              key={element.adhaar_number}
              name={element.name}
              adhaar={element.adhaar_number}
              email={element.email}
              date={element.Date_missing?.substring(0, 10)}
              height={element.height?.$numberDecimal}
              identification={element.identification}
              gender={element.Gender}
              address={element.address}
              image={src}
              onDelete={handleDeleted}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Missing_persons;