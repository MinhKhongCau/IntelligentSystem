import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import CameraForm from './CameraForm';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const VIDEO_STREAM_URL = 'http://localhost:5001';

const ManageCameras = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);

  const fetchCameras = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/cctv`);
      setCameras(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching cameras:', err);
      setError('Failed to load cameras.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  const handleAdd = () => {
    setEditingCamera(null);
    setShowForm(true);
  };

  const handleEdit = (camera) => {
    setEditingCamera(camera);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this camera?')) return;
    try {
      await axios.delete(`${API_BASE}/api/cctv/${id}`);
      setCameras(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting camera:', err);
      alert('Failed to delete camera.');
    }
  };

  const openStreamWindow = (camera) => {
    // If camera has explicit streamUrl use it, otherwise construct query to stream server
    const url = camera.streamUrl && camera.streamUrl.startsWith('http')
      ? camera.streamUrl
      : `${VIDEO_STREAM_URL}/?cameraIp=${encodeURIComponent(camera.ip || '')}`;

    window.open(url, `_blank`, 'toolbar=0,location=0,menubar=0,width=920,height=600');
  };

  const handleSaved = (savedCamera) => {
    // Upsert into list
    setCameras(prev => {
      const found = prev.find(p => p.id === savedCamera.id);
      if (found) return prev.map(p => p.id === savedCamera.id ? savedCamera : p);
      return [savedCamera, ...prev];
    });
    setShowForm(false);
    setEditingCamera(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage Cameras</h1>
          <div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >Add Camera</button>
          </div>
        </div>

        {loading ? <div className="p-8 text-center">Loading cameras...</div> : null}
        {error ? <div className="p-4 text-red-600">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cameras.map(cam => (
            <div key={cam.id} className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-semibold">{cam.name || `Camera ${cam.id}`}</div>
                  <div className="text-sm text-gray-600">IP: {cam.ip || 'N/A'}</div>
                  {cam.streamUrl && (
                    <div className="text-sm text-gray-600">Stream: {cam.streamUrl}</div>
                  )}
                  {cam.location && (
                    <div className="text-sm text-gray-600">Location: {cam.location.province || cam.location.district || ''}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openStreamWindow(cam)} className="px-3 py-1 bg-indigo-600 text-white rounded">View Stream</button>
                  <button onClick={() => handleEdit(cam)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDelete(cam.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl">
              <CameraForm
                initialData={editingCamera}
                onClose={() => { setShowForm(false); setEditingCamera(null); }}
                onSaved={handleSaved}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCameras;
