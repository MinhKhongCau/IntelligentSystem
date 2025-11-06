import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const { user, logout, isAuthenticated, roles } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/logout');
  };

  const isPolice = roles.includes('POLICE');
  const dashboardPath = isPolice ? '/police-dashboard' : '/dashboard';
  console.log('dashboardPath:', dashboardPath);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <div className="brand-logo">🔍</div>
            <span className="brand-text">FindOne</span>
          </Link>
        </div>

        <div className="navbar-menu">
          <div className={`navbar-links ${menu ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Home</Link>
            {isAuthenticated && (
              <Link to="/missingpeople" className="nav-link">Missing List</Link>
            )}
            {isAuthenticated && (
              <Link to="/locations" className="nav-link">Locations</Link>
            )}{isAuthenticated && (
              <Link to="/missinglocations" className="nav-link"> Surveillance </Link>
            )}
          </div>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <div className="auth-section">
                <span className="user-welcome">Welcome, {user?.username}</span>
                <Link to={dashboardPath} className="nav-button">Dashboard</Link>
                <button onClick={handleLogout} className="nav-button logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="nav-button login-btn">
                Login
              </Link>
            )}
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMenu(!menu)}
          >
            <span className={`hamburger ${menu ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
