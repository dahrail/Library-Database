import React, { useState } from 'react';
import '../../styles/auth/Auth.css';

const RegisterAsFaculty = ({ navigateToRegister }) => {
  const [newUser, setNewUser] = useState({
    Username: '',
    Password: '',
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: ''
  });

  const [phoneParts, setPhoneParts] = useState({ part1: '', part2: '', part3: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value) && value.length <= (name === 'part1' || name === 'part2' ? 3 : 4)) {
      setPhoneParts((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const combinedPhoneNumber = parseInt(`${phoneParts.part1}${phoneParts.part2}${phoneParts.part3}`, 10); // Combine and convert to integer
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, PhoneNumber: combinedPhoneNumber, Role: 'Faculty' })
      });

      const data = await response.json();

      if (data.success) {
        alert('Faculty registration successful!');
        navigateToRegister();
      } else {
        alert('Failed to register as faculty: ' + data.error);
      }
    } catch (error) {
      console.error('Error registering as faculty:', error);
      alert('An error occurred while registering as faculty.');
    }
  };

  return (
    <div className="content-container">
      <h2>Register as Faculty</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="Username"
            value={newUser.Username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            value={newUser.Password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="FirstName"
            value={newUser.FirstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="LastName"
            value={newUser.LastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={newUser.Email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input
              type="text"
              name="part1"
              value={phoneParts.part1}
              onChange={handlePhoneChange}
              required
              placeholder="XXX"
              maxLength="3"
              style={{ width: '50px', textAlign: 'center' }} // Set width and center-align text
            />
            <span>-</span>
            <input
              type="text"
              name="part2"
              value={phoneParts.part2}
              onChange={handlePhoneChange}
              required
              placeholder="XXX"
              maxLength="3"
              style={{ width: '50px', textAlign: 'center' }} // Set width and center-align text
            />
            <span>-</span>
            <input
              type="text"
              name="part3"
              value={phoneParts.part3}
              onChange={handlePhoneChange}
              required
              placeholder="XXXX"
              maxLength="4"
              style={{ width: '65px', textAlign: 'center' }} // Slightly wider for 4 digits
            />
          </div>
        </div>
        <button type="submit">Confirm</button>
      </form>
      <button onClick={navigateToRegister}>Back to Register</button>
    </div>
  );
};

export default RegisterAsFaculty;