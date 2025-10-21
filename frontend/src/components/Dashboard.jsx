import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/logout');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
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
            <h3>Report Missing Person</h3>
            <p>Submit a new missing person report</p>
            <button 
              onClick={() => navigate('/Formmissing')}
              className="card-button"
            >
              Submit Report
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Tracked Locations</h3>
            <p>View location tracking data</p>
            <button 
              onClick={() => navigate('/locations')}
              className="card-button"
            >
              View Locations
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Surveillance</h3>
            <p>Access surveillance area</p>
            <button 
              onClick={() => window.open('http://localhost:8501/', '_blank')}
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

export default Dashboard;
