import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const AllVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${API_BASE}/api/volunteers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVolunteers(resp.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load volunteers');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-6">Loading volunteers...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Volunteers ({volunteers.length})</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteers.map(v => (
            <div key={v.id} className="bg-white rounded-lg p-4 shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                <img src={v.profilePictureUrl ? `${v.profilePictureUrl.startsWith('http') ? '' : API_BASE}${v.profilePictureUrl}`.replace(/^(http:\/\/http:\/\/|http:\/\/https:\/\/|https:\/\/http:\/\/)/, '') : '/'} alt={v.fullName || v.username}
                  className="w-16 h-16 rounded-full object-cover border" onError={(e)=>e.currentTarget.style.display='none'} />
                <div className="flex-1">
                  <div className="font-semibold text-lg">{v.fullName || v.username}</div>
                  <div className="text-sm text-gray-600">{v.username}</div>
                </div>
                <div>
                  <button onClick={() => navigate(`/volunteers/${v.id}`)} className="px-3 py-1 bg-blue-600 text-white rounded">View</button>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <div><strong>Phone:</strong> {v.phone || 'N/A'}</div>
                <div><strong>Email:</strong> {v.email || 'N/A'}</div>
                <div><strong>Rating:</strong> {v.rating ?? 'N/A'}</div>
                {v.skills && <div className="mt-2"><strong>Skills:</strong> <div className="text-xs mt-1 bg-gray-50 p-2 rounded">{v.skills}</div></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllVolunteers;
