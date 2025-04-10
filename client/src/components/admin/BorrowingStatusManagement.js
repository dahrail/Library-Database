import React, { useState, useEffect } from 'react';
import '../../styles/admin/BorrowingStatusManagement.css';

const BorrowingStatusManagement = () => {
  const [statuses, setStatuses] = useState([
    { id: 1, name: 'Borrowed', canEdit: true },
    { id: 2, name: 'Returned', canEdit: true },
    { id: 3, name: 'Overdue', canEdit: true },
    { id: 4, name: 'Lost', canEdit: true },
    { id: 5, name: 'Damaged', canEdit: true }
  ]);
  
  const [borrowingSettings, setBorrowingSettings] = useState({
    studentDays: 7,
    facultyDays: 14,
    adminDays: 21,
    maxRenewals: 2
  });
  
  const [editingStatus, setEditingStatus] = useState(null);
  const [editedName, setEditedName] = useState('');
  
  const handleEditClick = (status) => {
    setEditingStatus(status.id);
    setEditedName(status.name);
  };
  
  const handleSaveStatus = () => {
    setStatuses(statuses.map(status => 
      status.id === editingStatus 
        ? { ...status, name: editedName } 
        : status
    ));
    setEditingStatus(null);
  };
  
  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setBorrowingSettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };
  
  const saveSettings = async () => {
    try {
      // This would be replaced with an actual API call in a real implementation
      alert('Borrowing settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred while saving settings.');
    }
  };
  
  return (
    <div className="borrowing-status-management">
      <h3>Manage Borrowing Status</h3>
      
      <div className="status-list">
        <table>
          <thead>
            <tr>
              <th>Status ID</th>
              <th>Status Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map(status => (
              <tr key={status.id}>
                <td>{status.id}</td>
                <td>
                  {editingStatus === status.id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    status.name
                  )}
                </td>
                <td>
                  {editingStatus === status.id ? (
                    <button onClick={handleSaveStatus}>Save</button>
                  ) : (
                    <button 
                      onClick={() => handleEditClick(status)}
                      disabled={!status.canEdit}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="borrowing-settings">
        <h3>Borrowing Duration Settings</h3>
        <div className="settings-form">
          <div className="form-group">
            <label>Student Borrowing Days:</label>
            <input
              type="number"
              name="studentDays"
              value={borrowingSettings.studentDays}
              onChange={handleSettingChange}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label>Faculty Borrowing Days:</label>
            <input
              type="number"
              name="facultyDays"
              value={borrowingSettings.facultyDays}
              onChange={handleSettingChange}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label>Admin Borrowing Days:</label>
            <input
              type="number"
              name="adminDays"
              value={borrowingSettings.adminDays}
              onChange={handleSettingChange}
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label>Maximum Renewals:</label>
            <input
              type="number"
              name="maxRenewals"
              value={borrowingSettings.maxRenewals}
              onChange={handleSettingChange}
              min="0"
            />
          </div>
          
          <button onClick={saveSettings}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default BorrowingStatusManagement;
