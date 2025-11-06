import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const MissingListItem = ({ missingPerson, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center">
        <div>
          <p className="text-lg font-semibold text-gray-800">{missingPerson.name}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Detail
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Finded
        </button>
        {missingPerson.status === 'Finding' && (
          <button 
            onClick={() => onDelete(missingPerson.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const ManageMissingList = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissingPersons = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE}/api/missing-documents`);
        setMissingPersons(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setMissingPersons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMissingPersons();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/missing-documents/${id}`);
      setMissingPersons(missingPersons.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting data:", err);
      setError("Không thể xóa dữ liệu. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Missing Persons</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {missingPersons.map(person => (
            <MissingListItem key={person.id} missingPerson={person} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMissingList;
