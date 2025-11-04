import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, roles } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/logout');
  };

  const isCarePartner = roles.includes('CARE_PARTNER');

  console.log('User roles:', roles);
  console.log('Is Care Partner:', isCarePartner);
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
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

          {!isCarePartner ? (
            <div className="dashboard-card">
              <h3>Report Missing Person</h3>
              <p>Submit a new missing person report</p>
              <button 
                onClick={() => navigate('/formmissing')}
                className="card-button"
              >
                Submit Report
              </button>
            </div>
          ) : (
            <div className="dashboard-card">
              <h3>Report Missing Person</h3>
              <p>You must be a care partner to submit a report</p>
              <button 
                className="card-button"
                onClick={() => navigate('/formmissing')}
              >
                Submit a report
              </button>
            </div>
            )
          }
          
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
              onClick={() => navigate('/missinglocations')}
              className="card-button"
            >
              Open Surveillance
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Register Care Partner</h3>
            {isCarePartner ? (
              <>
                <p>You are already registered as a care partner.</p>
                <button className="card-button card-button-disabled" disabled>
                  Registered
                </button>
              </>
            ) : (
              <>
                <p>Register a new care partner account</p>
                <button onClick={() => navigate('/register-care-partner')} className="card-button">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
