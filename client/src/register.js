import React, { useState } from "react";
import axios from "axios";

const Register = ({ navigateToLogin }) => {
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    Role: "Student",
    Department: "",
    Designation: "",
    OfficeLocation: "",
    PhoneExtension: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );

      if (response.data.success) {
        alert("Registration successful");
        // Clear the form
        setFormData({
          Username: "",
          Password: "",
          FirstName: "",
          LastName: "",
          Email: "",
          PhoneNumber: "",
          Role: "Student",
          Department: "",
          Designation: "",
          OfficeLocation: "",
          PhoneExtension: "",
        });
        navigateToLogin(); // Navigate back to the login screen
      } else {
        alert("Failed to register");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Error registering");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="Username"
          value={formData.Username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="FirstName"
          value={formData.FirstName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          name="LastName"
          value={formData.LastName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          name="PhoneNumber"
          value={formData.PhoneNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <select
          name="Role"
          value={formData.Role}
          onChange={handleChange}
          required
        >
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
        </select>
      </div>
      {formData.Role === "Faculty" && (
        <>
          <div>
            <label>Department:</label>
            <input
              type="text"
              name="Department"
              value={formData.Department}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Designation:</label>
            <input
              type="text"
              name="Designation"
              value={formData.Designation}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Office Location:</label>
            <input
              type="text"
              name="OfficeLocation"
              value={formData.OfficeLocation}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone Extension:</label>
            <input
              type="text"
              name="PhoneExtension"
              value={formData.PhoneExtension}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}
      <button type="submit">Register</button>
      <button type="button" onClick={navigateToLogin}>
        Back to Login
      </button>
    </form>
  );
};

export default Register;
