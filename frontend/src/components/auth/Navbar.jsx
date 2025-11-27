import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-32 lg:py-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-white no-underline hover:opacity-90 transition-opacity duration-200">
              <span className="text-2xl mr-2">🔍</span>
              <span className="text-xl font-bold tracking-wide">FindOne</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/" 
              className="text-white no-underline font-medium text-lg px-3 py-2 rounded-md hover:bg-gray-400 transition-all duration-200"
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/missingpeople" 
                  className="text-white no-underline font-medium text-lg px-3 py-2 rounded-md hover:bg-gray-400 transition-all duration-200"
                >
                  Missing List
                </Link>
                <Link 
                  to="/my-subscriptions" 
                  className="text-white no-underline font-medium text-lg px-3 py-2 rounded-md hover:bg-gray-400 transition-all duration-200"
                >
                  Subscriptions
                </Link>
                <Link 
                  to="/locations" 
                  className="text-white no-underline font-medium text-lg px-3 py-2 rounded-md hover:bg-gray-400 transition-all duration-200"
                >
                  Locations
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-white text-lg font-medium">
                  Welcome, {user?.username}
                </span>
                <Link 
                  to={dashboardPath} 
                  className="px-4 py-2 rounded-lg text-white font-medium text-lg border border-white/30 hover:bg-gray-400 transition-all duration-200 no-underline"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 rounded-lg text-white font-medium text-lg bg-red-600 hover:bg-red-700 transition-colors duration-200 border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg text-white font-medium text-lg border border-white/30 hover:bg-gray-400 transition-all duration-200 no-underline"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
          >
            <svg 
              className="h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {menu ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${menu ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-r from-indigo-600 to-purple-700">
          <Link 
            to="/" 
            className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-400 transition-all duration-200 no-underline"
            onClick={() => setMenu(false)}
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                to="/missingpeople" 
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-400 transition-all duration-200 no-underline"
                onClick={() => setMenu(false)}
              >
                Missing List
              </Link>
              <Link 
                to="/my-subscriptions" 
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-400 transition-all duration-200 no-underline"
                onClick={() => setMenu(false)}
              >
                My Subscriptions
              </Link>
              <Link 
                to="/locations" 
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-400 transition-all duration-200 no-underline"
                onClick={() => setMenu(false)}
              >
                Locations
              </Link>
            </>
          )}
          
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-white/20">
              <div className="flex items-center px-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{user?.username}</div>
                </div>
              </div>
              <div className="space-y-1 px-2">
                <Link 
                  to={dashboardPath} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-400 transition-all duration-200 no-underline"
                  onClick={() => setMenu(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenu(false);
                  }} 
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 border-none cursor-pointer transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-400 transition-all duration-200 no-underline"
              onClick={() => setMenu(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;