import React, { useEffect, useState, useCallback } from 'react';
import missingimg from './missingguy.png';
import './Missing_persons.css';
import PersonCard from './PersonCard';
import axios from 'axios'; // <-- Nên dùng axios để nhất quán

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Missing_persons = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getdata = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/missing-documents`);
      
      setCases(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Failed to load cases. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getdata();
  }, [getdata]);

  const handleDeleted = (id) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="personwhole" style={{ backgroundColor: '#f1f1f1' }}>
      <div className="personheader">
        <div className="subheadingmissing">
          <div className="text-4xl">Missing People</div>
          <img src={missingimg} alt="" width="70" />
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>}
      {error && <div className="error" style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>}

      <div className="contentlist">
        {cases.map((element) => {
          // Handle URL Image
          const imageUrl = element.facePictureUrl?.startsWith('http') 
            ? element.facePictureUrl 
            : `${API_BASE}${element.facePictureUrl}`;

          return (
            <PersonCard
              key={element.id}
              id={element.id}
              name={element.fullName} 
              image={imageUrl}
              missingTime={element.missingTime}
              caseStatus={element.caseStatus}
              missingArea={element.missingArea} 
              onDelete={handleDeleted}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Missing_persons;