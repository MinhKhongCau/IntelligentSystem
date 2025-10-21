import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Call logout endpoint if available
          await axios.post('http://localhost:8080/api/auth/logout', {}, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
      } catch (error) {
        // Even if logout API fails, we still clear local storage
        console.log('Logout API call failed:', error);
      } finally {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="logout-container">
      <div className="logout-card">
        <div className="logout-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        
        <h2>Logging Out</h2>
        <p>You have been successfully logged out.</p>
        <p>Redirecting to login page...</p>
        
        <div className="logout-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
