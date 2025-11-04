import React, { useState, useEffect } from 'react';
import './ManageMissingForms.css';

const ManageMissingForms = () => {
  const [documents, setDocuments] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/missing-documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching missing documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const updateDocumentStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/missing-documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caseStatus: status }),
      });

      if (response.ok) {
        setNotification({ message: `Document ${status.toLowerCase()} successfully!`, type: 'success' });
        fetchDocuments();
      } else {
        const errorData = await response.json();
        setNotification({ message: errorData.message || 'Error updating document', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating document:', error);
      setNotification({ message: 'Error updating document', type: 'error' });
    }
  };

  const handleAccept = (id) => {
    updateDocumentStatus(id, 'Accepted');
  };

  const handleReject = (id) => {
    updateDocumentStatus(id, 'Rejected');
  };

  return (
    <div className="manage-forms-container">
      <h1>Manage Missing Forms</h1>
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <button className="create-form-btn">Create New Form</button>
      <table className="forms-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.id}</td>
              <td>{doc.fullName}</td>
              <td>{doc.caseStatus}</td>
              <td>
                <button onClick={() => handleAccept(doc.id)} className="accept-btn">Accept</button>
                <button onClick={() => handleReject(doc.id)} className="reject-btn">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageMissingForms;
