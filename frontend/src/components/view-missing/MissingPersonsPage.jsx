import React, { useEffect, useState, useCallback } from 'react';
import missingimg from './missingguy.png';
import PersonCard from './PersonCard';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Missing_persons = () => {
  const [cases, setCases] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getdata = useCallback(async (p = page) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: p, size };
      if (searchTerm && searchTerm.trim().length > 0) params.name = searchTerm.trim();
      const res = await axios.get(`${API_BASE}/api/missing-documents/search`, { params });
      const data = res.data;
      const list = Array.isArray(data) ? data : (data.content || []);
      const missingCases = list.filter(c => c.caseStatus === 'Missing');
      setCases(missingCases);
      if (data && data.totalPages !== undefined) setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Failed to load cases. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, size, searchTerm]);

  useEffect(() => {
    const t = setTimeout(() => getdata(page), 300);
    return () => clearTimeout(t);
  }, [page, searchTerm]);

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
        <div className="flex justify-end mb-6">
          <input
            type="search"
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            className="ml-4 p-2 border border-gray-300 items-end rounded w-64 gap-6"
            />
        </div>
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
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => { if (page > 0) setPage(p => p - 1); }}
            disabled={page <= 0}
            className={`px-4 py-2 rounded ${page <= 0 ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
          >Prev</button>
          <div className="text-sm text-gray-700">Page {page + 1} {totalPages ? `of ${totalPages}` : ''}</div>
          <button
            onClick={() => { if (totalPages === 0 || page + 1 < totalPages) setPage(p => p + 1); }}
            disabled={totalPages > 0 && page + 1 >= totalPages}
            className={`px-4 py-2 rounded ${totalPages > 0 && page + 1 >= totalPages ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default Missing_persons;