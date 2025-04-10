import React, { useState } from 'react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    checkoutDuration: {
      student: 14,
      faculty: 30,
      admin: 45
    },
    maxCheckouts: {
      student: 5,
      faculty: 10,
      admin: 15
    },
    maxRenewals: 2,
    fineRate: 0.25, // per day
    emailNotifications: true,
    autoRenewals: false,
    maintenanceMode: false
  });

  const handleInputChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: Number(value)
      }
    }));
  };

  const handleCheckboxChange = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSimpleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: typeof prev[field] === 'number' ? Number(value) : value
    }));
  };

  const saveSettings = async () => {
    try {
      // This would be replaced with an actual API call
      console.log('Saving settings:', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  return (
    <div className="system-settings">
      <h3>System Settings</h3>
      
      <div className="settings-section">
        <h4>Loan Duration (Days)</h4>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Student</label>
            <input 
              type="number"
              min="1"
              value={settings.checkoutDuration.student}
              onChange={(e) => handleInputChange('checkoutDuration', 'student', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label>Faculty</label>
            <input 
              type="number"
              min="1"
              value={settings.checkoutDuration.faculty}
              onChange={(e) => handleInputChange('checkoutDuration', 'faculty', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label>Admin</label>
            <input 
              type="number"
              min="1"
              value={settings.checkoutDuration.admin}
              onChange={(e) => handleInputChange('checkoutDuration', 'admin', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h4>Maximum Checkouts</h4>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Student</label>
            <input 
              type="number"
              min="1"
              value={settings.maxCheckouts.student}
              onChange={(e) => handleInputChange('maxCheckouts', 'student', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label>Faculty</label>
            <input 
              type="number"
              min="1"
              value={settings.maxCheckouts.faculty}
              onChange={(e) => handleInputChange('maxCheckouts', 'faculty', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label>Admin</label>
            <input 
              type="number"
              min="1"
              value={settings.maxCheckouts.admin}
              onChange={(e) => handleInputChange('maxCheckouts', 'admin', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h4>Fines & Renewals</h4>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Fine Rate ($ per day)</label>
            <input 
              type="number"
              step="0.01"
              min="0"
              value={settings.fineRate}
              onChange={(e) => handleSimpleInputChange('fineRate', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <label>Maximum Renewals</label>
            <input 
              type="number"
              min="0"
              value={settings.maxRenewals}
              onChange={(e) => handleSimpleInputChange('maxRenewals', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h4>System Options</h4>
        <div className="settings-checkboxes">
          <div className="setting-checkbox">
            <input 
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={() => handleCheckboxChange('emailNotifications')}
            />
            <label htmlFor="emailNotifications">Enable Email Notifications</label>
          </div>
          
          <div className="setting-checkbox">
            <input 
              type="checkbox"
              id="autoRenewals"
              checked={settings.autoRenewals}
              onChange={() => handleCheckboxChange('autoRenewals')}
            />
            <label htmlFor="autoRenewals">Enable Automatic Renewals</label>
          </div>
          
          <div className="setting-checkbox">
            <input 
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={() => handleCheckboxChange('maintenanceMode')}
            />
            <label htmlFor="maintenanceMode">Maintenance Mode</label>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button onClick={saveSettings}>Save Settings</button>
      </div>
    </div>
  );
};

export default SystemSettings;
