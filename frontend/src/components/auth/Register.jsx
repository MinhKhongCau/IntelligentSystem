import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    birthday: "",
    address: "",
    gender: "male",
    phone: "",
    profilePictureUrl: "",
    accountType: "user",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          email: form.email,
          fullName: form.fullName,
          birthday: form.birthday || null,
          address: form.address,
          gender: form.gender === "male" ? true : false,
          phone: form.phone,
          profilePictureUrl: form.profilePictureUrl,
          accountType: form.accountType,
        }),
      });

      const text = await res.text();
      if (!res.ok) {
        setMessage(text || "Registration failed");
        setLoading(false);
        return;
      }

      setMessage("Registration successful");
      setLoading(false);
      // navigate to login after short delay
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setMessage("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="register-wrap">
      <form className="register-form" onSubmit={onSubmit}>
        <h2>Create account</h2>

        {message && <div className="register-message">{message}</div>}

        <label>Username</label>
        <input name="username" value={form.username} onChange={onChange} required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} required />

        <label>Full name</label>
        <input name="fullName" value={form.fullName} onChange={onChange} />

        <label>Birthday</label>
        <input name="birthday" type="date" value={form.birthday} onChange={onChange} />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={onChange} />

        <label>Gender</label>
        <div className="gender-row">
          <label><input type="radio" name="gender" value="male" checked={form.gender === "male"} onChange={onChange} /> Male</label>
          <label><input type="radio" name="gender" value="female" checked={form.gender === "female"} onChange={onChange} /> Female</label>
        </div>

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={onChange} />

        <label>Profile picture URL</label>
        <input name="profilePictureUrl" value={form.profilePictureUrl} onChange={onChange} />

        <label>Account type</label>
        <select name="accountType" value={form.accountType} onChange={onChange}>
          <option value="user">User</option>
          <option value="volunteer">Volunteer</option>
          <option value="police">Police</option>
        </select>

        <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>
    </div>
  );
}