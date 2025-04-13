import React, { useState, useEffect } from 'react';
import '../../styles/admin/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Username: '',
    Password: '',
    Role: 'Student'
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetPassword = async (userId) => {
    if (!window.confirm('Are you sure you want to reset this user\'s password?')) return;
    
    try {
      const response = await fetch(`/api/resetPassword/${userId}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Password reset successfully. Temporary password: ' + data.tempPassword);
        fetchUsers();
      } else {
        alert('Failed to reset password: ' + data.error);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('An error occurred while resetting the password.');
    }
  };
  
  const addUser = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('User added successfully!');
        setNewUser({
          FirstName: '',
          LastName: '',
          Email: '',
          Username: '',
          Password: '',
          Role: 'Student'
        });
        setShowAddForm(false);
        fetchUsers();
      } else {
        alert('Failed to add user: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user.');
    }
  };
  
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('User deleted successfully!');
        fetchUsers();
      } else {
        alert('Failed to delete user: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="user-management">
      <h3>User Management</h3>
      
      <div className="user-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>
      
      {showAddForm && (
        <form onSubmit={addUser} className="add-user-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="FirstName"
                value={newUser.FirstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="LastName"
                value={newUser.LastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="Email"
                value={newUser.Email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="Username"
                value={newUser.Username}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="Password"
                value={newUser.Password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="Role"
                value={newUser.Role}
                onChange={handleInputChange}
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit">Add User</button>
          </div>
        </form>
      )}
      
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.UserID}>
                <td>{user.FirstName} {user.LastName}</td>
                <td>{user.Email}</td>
                <td>{user.Username}</td>
                <td>{user.Role}</td>
                <td className="actions-cell">
                  <button onClick={() => resetPassword(user.UserID)}>Reset Password</button>
                  <button onClick={() => setSelectedUser(user)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteUser(user.UserID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
