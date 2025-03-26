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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, Role: 'Faculty' }) // Set Role to 'Faculty'
      });

      const data = await response.json();

      if (data.success) {
        alert('Faculty registration successful!');
        navigateToRegister(); // Navigate back to the main register screen
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
          <input
            type="text"
            name="PhoneNumber"
            value={newUser.PhoneNumber}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Confirm</button>
      </form>
      <button onClick={navigateToRegister}>Back to Register</button>
    </div>
  );
};

export default RegisterAsFaculty;