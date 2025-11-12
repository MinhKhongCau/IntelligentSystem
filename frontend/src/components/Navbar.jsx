import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center text-white no-underline">
            <div className="text-2xl mr-2">🔍</div>
            <span className="text-xl font-bold tracking-wide">FindOne</span>
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <div className={`hidden md:flex items-center space-x-4`}>
            <Link to="/" className="text-white no-underline font-medium text-base px-3 py-2 rounded-md hover:opacity-75 hover:bg-gray-400 hover:backdrop-blur-sm transition-all duration-300">Home</Link>
            {isAuthenticated && (
              <Link to="/missingpeople" className="text-white no-underline font-medium text-base px-3 py-2 rounded-md hover:bg-gray-400 hover:opacity-75 hover:backdrop-blur-sm transition-all duration-300">Missing List</Link>
            )}
            {isAuthenticated && (
              <Link to="/my-subscriptions" className="text-white no-underline font-medium text-base px-3 py-2 rounded-md hover:bg-gray-400 hover:opacity-75 hover:backdrop-blur-sm transition-all duration-300">My Subscriptions</Link>
            )}
            {isAuthenticated && (
              <Link to="/locations" className="text-white no-underline font-medium text-base px-3 py-2 rounded-md hover:bg-gray-400 hover:opacity-75 hover:backdrop-blur-sm transition-all duration-300">Locations</Link>
            )}
            {/* {isAuthenticated && (
              <Link to="/missinglocations" className="text-white no-underline font-medium text-base px-3 py-2 rounded-md hover:bg-gray-400 hover:opacity-75 hover:backdrop-blur-sm transition-all duration-300"> Surveillance </Link>
            )} */}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm font-medium">Welcome, {user?.username}</span>
                <Link to={dashboardPath} className="px-3 py-2 rounded-md text-white font-medium text-sm border border-white hover:bg-gray-400 hover:bg-white-500 hover:bg-opacity-30 transition-all duration-300 no-underline">Dashboard</Link>
                <button onClick={handleLogout} className="px-3 py-2 rounded-md text-white font-medium text-sm bg-red-600 hover:bg-red-700 transition-colors duration-300 border-none cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-3 py-2 rounded-md text-white font-medium text-sm border border-white border-opacity-30 hover:bg-gray-400 transition-all duration-300 no-underline">
                Login
              </Link>
            )}
          </div>

          <button 
            className="md:hidden p-1 rounded-md text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setMenu(!menu)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {menu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`md:hidden ${menu ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-10 hover:backdrop-blur-sm">Home</Link>
          {isAuthenticated && (
            <Link to="/missingpeople" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-400 hover:opacity-75 hover:backdrop-blur-sm">Missing List</Link>
          )}
          {isAuthenticated && (
            <Link to="/my-subscriptions" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-400 hover:opacity-75 hover:backdrop-blur-sm">My Subscriptions</Link>
          )}
          {isAuthenticated && (
            <Link to="/locations" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-400 hover:opacity-75 hover:backdrop-blur-sm">Locations</Link>
          )}
          {isAuthenticated && (
            <Link to="/missinglocations" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-400 hover:opacity-75 hover:backdrop-blur-sm"> Surveillance </Link>
          )}
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  {/* User avatar can go here */}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{user?.username}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link to={dashboardPath} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-400 hover:opacity-75 hover:backdrop-blur-sm">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:opacity-90 hover:backdrop-blur-sm bg-red-600 hover:bg-red-700 border-none cursor-pointer">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-300 hover:opacity-75 hover:backdrop-blur-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;