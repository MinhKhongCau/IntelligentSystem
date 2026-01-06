import React, { useState } from 'react';
import axios from 'axios';
import AddMissingArea from '../missing-form/AddmissingArea';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const CameraForm = ({ initialData = null, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    ip: initialData?.ip || '',
    streamUrl: initialData?.streamUrl || '',
    location: initialData?.location || null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showAddArea, setShowAddArea] = useState(false);

  const handleAreaAdded = (area) => {
    setForm(prev => ({ ...prev, location: area }));
    setShowAddArea(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        ip: form.ip,
        streamUrl: form.streamUrl,
        locationId: form.location?.id || null,
      };

      let res;
      if (initialData && initialData.id) {
        res = await axios.put(`${API_BASE}/api/cctv/${initialData.id}`, payload);
      } else {
        res = await axios.post(`${API_BASE}/api/cctv`, payload);
      }

      if (res?.data) {
        onSaved(res.data);
      }
    } catch (err) {
      console.error('Error saving camera:', err);
      alert(err.response?.data?.message || 'Failed to save camera.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{initialData ? 'Edit Camera' : 'Add Camera'}</h2>
        <button onClick={onClose} className="text-gray-600 text-2xl">×</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">IP Address</label>
          <input
            value={form.ip}
            onChange={(e) => setForm({ ...form, ip: e.target.value })}
            placeholder="e.g., 192.168.1.10"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stream URL (optional)</label>
          <input
            value={form.streamUrl}
            onChange={(e) => setForm({ ...form, streamUrl: e.target.value })}
            placeholder="http://..."
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          {form.location ? (
            <div className="p-3 border rounded mb-2">
              <div className="text-sm">{form.location.commune || ''} {form.location.district || ''} {form.location.province || ''}</div>
              <div className="text-xs text-gray-500">Lat: {form.location.latitude}, Lng: {form.location.longitude}</div>
              <button type="button" onClick={() => setForm({ ...form, location: null })} className="mt-2 text-sm text-red-600">Remove</button>
            </div>
          ) : (
            <button type="button" onClick={() => setShowAddArea(true)} className="px-3 py-2 bg-blue-600 text-white rounded">Add Location</button>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded">{submitting ? 'Saving...' : 'Save'}</button>
        </div>
      </form>

      {showAddArea && (
        <div className="mt-4 border-t pt-4">
          <AddMissingArea onAreaAdded={handleAreaAdded} onClose={() => setShowAddArea(false)} />
        </div>
      )}
    </div>
  );
};

export default CameraForm;
