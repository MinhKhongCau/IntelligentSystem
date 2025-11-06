import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageAccounts.css';
import PersonCard from '../../missing_list/PersonCard';
import AccountCard from './AccountCard';

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

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('/api/accounts');
      setAccounts(response.data); // Assuming the backend returns a Page object with content
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // client-side verify password check
    if (formData.password !== formData.verifyPassword) {
      // You might want to handle this error, e.g., by showing an alert
      setLoading(false);
      return;
    }

    try {
      await axios.post("/api/auth/register", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        birthday: formData.birthday || null,
        address: formData.address,
        gender: formData.gender === "male" ? true : false,
        phone: formData.phone,
        profilePictureUrl: formData.profilePictureUrl,
      });

      setLoading(false);
      fetchAccounts(); // Refresh accounts after successful registration
    } catch (err) {
      // You might want to handle this error, e.g., by showing an alert
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`/accounts/${id}/accept`);
      fetchAccounts(); // Refresh the list after accepting
    } catch (error) {
      console.error('Error accepting account:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`/accounts/${id}`);
      fetchAccounts(); // Refresh the list after rejecting
    } catch (error) {
      console.error('Error rejecting account:', error);
    }
  };

  return (
    <div className="manage-accounts-container">
      <div className="create-account-form">
        <h2>Create New Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="verifyPassword" placeholder="Verify Password" value={formData.verifyPassword} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
          <input type="date" name="birthday" placeholder="Birthday" value={formData.birthday} onChange={handleChange} />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          <label>Gender</label>
          <div className="gender-row">
            <label><input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} /> Male</label>
            <label><input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} /> Female</label>
          </div>
          <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          <input type="text" name="profilePictureUrl" placeholder="Profile Picture URL" value={formData.profilePictureUrl} onChange={handleChange} />
          <button type="submit">Create Account</button>
        </form>
      </div>
      <div className="accounts-list">
        <h2>All Accounts</h2>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <AccountCard account={account}/>
          ))
        ) : (
          <p>No accounts found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageAccounts;
