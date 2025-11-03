import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './PoliceDashboard.css';

const PoliceDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/logout');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Police Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Missing Persons</h3>
            <p>Manage and view missing person reports</p>
            <button 
              onClick={() => navigate('/Missingpeople')}
              className="card-button"
            >
              View Reports
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Active Alerts</h3>
            <p>Manage and view active alerts</p>
            <button 
              onClick={() => navigate('/locations')}
              className="card-button"
            >
              Manage Alerts Locations
            </button>
          </div>
          
          <div className="dashboard-card">
            <h3>Map</h3>
            <p>View map of reported sightings</p>
            <button 
              onClick={() => navigate('/locations')}
              className="card-button"
            >
              View Map
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Surveillance</h3>
            <p>Access surveillance area</p>
            <button 
              onClick={() => window.open('/missinglocations', '_blank')}
              className="card-button"
            >
              Open Surveillance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;