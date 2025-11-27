import React, { useEffect, useState, useCallback } from 'react';
import missingimg from './missingguy.png';
import PersonCard from './PersonCard';
import axios from 'axios';

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
      const allCases = Array.isArray(res.data) ? res.data : [];
      // Filter to show only cases with "Missing" status
      const missingCases = allCases.filter(c => c.caseStatus === 'Missing');
      setCases(missingCases);
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
    <div className="min-h-screen bg-gray-300">
      <div className="flex justify-center w-screen overflow-x-hidden">
        <div className="flex items-center justify-center gap-4 mt-24 mb-20">
          <div className="text-4xl font-bold font-sans">Missing People</div>
          <img src={missingimg} alt="" className="w-16 h-16" />
        </div>
      </div>

      {loading && <div className="text-center p-8 text-lg">Loading...</div>}
      {error && <div className="text-center p-8 text-red-600 font-medium">{error}</div>}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="gap-6 px-4 md:px-0">
          {cases.map((element) => {
            const imageUrl = element.facePictureUrl?.startsWith('http') 
              ? element.facePictureUrl 
              : `${API_BASE}${element.facePictureUrl}`;

            return (
              <PersonCard
                key={element.id}
                id={element.id}
                name={element.name}
                image={imageUrl}
                birthday={element.birthday}
                gender={element.gender}
                identityCardNumber={element.identityCardNumber}
                height={element.height}
                weight={element.weight}
                identifyingCharacteristic={element.identifyingCharacteristic}
                lastKnownOutfit={element.lastKnownOutfit}
                medicalConditions={element.medicalConditions}
                facePictureUrl={element.facePictureUrl}
                missingTime={element.missingTime}
                reportDate={element.reportDate}
                reporterRelationship={element.reporterRelationship}
                caseStatus={element.caseStatus}
                missingArea={element.missingArea}
                reporterId={element.reporterId}
                onDelete={handleDeleted}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Missing_persons;