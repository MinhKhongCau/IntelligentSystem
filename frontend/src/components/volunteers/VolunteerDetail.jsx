import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const VolunteerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const resp = await axios.get(`${API_BASE}/api/volunteers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVolunteer(resp.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load volunteer');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!volunteer) return <div className="p-6">Volunteer not found</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 shadow">
        <div className="flex items-center gap-6">
          {volunteer.profilePictureUrl && (
            <img src={volunteer.profilePictureUrl.startsWith('http') ? volunteer.profilePictureUrl : `${API_BASE}${volunteer.profilePictureUrl}`} alt={volunteer.fullName}
              className="w-24 h-24 rounded-full object-cover" />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{volunteer.fullName || volunteer.username}</h2>
            <div className="text-sm text-gray-600">@{volunteer.username}</div>
            <div className="mt-2 text-sm">
              <div><strong>Phone:</strong> {volunteer.phone || 'N/A'}</div>
              <div><strong>Email:</strong> {volunteer.email || 'N/A'}</div>
              <div><strong>Joined:</strong> {volunteer.dateJoined || 'N/A'}</div>
              <div><strong>Rating:</strong> {volunteer.rating ?? 'N/A'}</div>
            </div>
          </div>
        </div>

        {volunteer.skills && (
          <div className="mt-6">
            <h3 className="font-semibold">Skills / Notes</h3>
            <div className="mt-2 text-sm bg-gray-50 p-3 rounded">{volunteer.skills}</div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-600 text-white rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetail;
