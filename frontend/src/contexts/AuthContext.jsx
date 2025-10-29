import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Check for existing token and user data on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRoles = localStorage.getItem('roles');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setRoles(storedRoles ? JSON.parse(storedRoles) : []);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });
      
      setLoading(false);
      if (response.data.accessToken) {
        const { accountDTO: userData } = response.data;
        
        console.log('Login successful:', userData);
        setToken(response.data.accessToken);
        setUser(userData);
        setIsAuthenticated(true);
        setRoles(userData.roles || []);
        
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('roles', JSON.stringify(userData.roles || []));
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
        
        return { success: true, account: userData };
      }
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('http://localhost:8080/api/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear state and localStorage
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setRoles([]);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const isAuthenticatedFn = () => !!isAuthenticated;

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
    roles
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
