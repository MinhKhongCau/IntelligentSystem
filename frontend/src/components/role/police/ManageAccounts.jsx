import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountCard from './AccountCard';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const ManageAccounts = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    verifyPassword: "",
    email: "",
    fullName: "",
    birthday: "",
    address: "",
    gender: "male",
    phone: "",
    profilePictureUrl: "",
  });
  const [accounts, setAccounts] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/api/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      showNotification('Error fetching accounts', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.verifyPassword) {
      showNotification('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/auth/register`, {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        birthday: formData.birthday || null,
        address: formData.address,
        gender: formData.gender === "male",
        phone: formData.phone,
        profilePictureUrl: formData.profilePictureUrl,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      showNotification('Account created successfully', 'success');
      setFormData({
        username: "",
        password: "",
        verifyPassword: "",
        email: "",
        fullName: "",
        birthday: "",
        address: "",
        gender: "male",
        phone: "",
        profilePictureUrl: "",
      });
      fetchAccounts();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error creating account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/api/accounts/${id}/accept`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showNotification('Account accepted successfully', 'success');
      fetchAccounts();
    } catch (error) {
      console.error('Error accepting account:', error);
      showNotification('Error accepting account', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/accounts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showNotification('Account deleted successfully', 'success');
      fetchAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      showNotification('Error deleting account', 'error');
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    // You can implement edit functionality here
    showNotification('Edit functionality coming soon', 'info');
  };

  const filteredAccounts = accounts.filter(account =>
    account.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      {notification.message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="flex gap-5 max-w-7xl min-w-96 mx-auto">
        {/* Create Account Form */}
        <div className="flex-[1_1_30%] bg-white p-5 rounded-lg shadow-md">
          <h2 className="mb-5 text-gray-800 text-2xl font-semibold">Create New Account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              className="p-2.5 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-500"
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              className="p-2.5 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-500"
            />
            <input 
              type="password" 
              name="verifyPassword" 
              placeholder="Verify Password" 
              value={formData.verifyPassword} 
              onChange={handleChange} 
              required 
              className="p-2.5 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-500"
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="p-2.5 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-500"
            />
            <input 
              type="text" 
              name="fullName" 
              placeholder="Full Name" 
              value={formData.fullName} 
              onChange={handleChange} 
              className="p-2.5 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-500"
            />
            <input 
              type="date" 
              name="birthday" 
              placeholder="Birthday" 
              value={formData.birthday} 
              onChange={handleChange} 
              className="p-2.5 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-500"
            />
            <input 
              type="text" 
              name="address" 
              placeholder="Address" 
              value={formData.address} 
              onChange={handleChange} 
              className="p-2.5 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-500"
            />
            
            <div>
              <label className="block mb-2 font-medium text-gray-700">Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="male" 
                    checked={formData.gender === "male"} 
                    onChange={handleChange}
                    className="mr-2"
                  /> 
                  Male
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="female" 
                    checked={formData.gender === "female"} 
                    onChange={handleChange}
                    className="mr-2"
                  /> 
                  Female
                </label>
              </div>
            </div>

            <input 
              type="tel" 
              name="phone" 
              placeholder="Phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className="p-2.5 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-500"
            />
            <input 
              type="text" 
              name="profilePictureUrl" 
              placeholder="Profile Picture URL" 
              value={formData.profilePictureUrl} 
              onChange={handleChange} 
              className="p-2.5 border border-gray-300 rounded text-base focus:outline-none focus:border-blue-500"
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded cursor-pointer text-base font-medium hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Accounts List */}
        <div className="flex-[1_1_70%] bg-white p-5 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-gray-800 text-2xl font-semibold">All Accounts ({filteredAccounts.length})</h2>
            <input
              type="search"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded w-64 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <AccountCard 
                  key={account.id}
                  account={account}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAccept={handleAccept}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-10">No accounts found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccounts;
