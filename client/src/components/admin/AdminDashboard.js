import React, { useState } from 'react';
import ItemReport from './ItemReport';
import UserReport from './UserReport';
import EventReport from './EventReport';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = ({ navigateToHome }) => {
  const [activeReport, setActiveReport] = useState(null);

  const renderReport = () => {
    switch (activeReport) {
      case 'itemReport':
      case 'userReport':
      case 'eventReport':
        return (
          <div>
            <div className="report-nav">
              <button 
                className="dashboard-button back-button" 
                onClick={() => setActiveReport(null)}
              >
                Back to Reports
              </button>
            </div>
            
            {activeReport === 'itemReport' && <ItemReport />}
            {activeReport === 'userReport' && <UserReport />}
            {activeReport === 'eventReport' && <EventReport />}
          </div>
        );
      default:
        return (
          <div className="admin-dashboard">
            <h2>Library Reports Dashboard</h2>
            <div className="admin-nav">
              <button 
                className={`dashboard-button`}
                onClick={() => setActiveReport('itemReport')}
              >
                Item Report
              </button>
              <button 
                className={`dashboard-button`}
                onClick={() => setActiveReport('userReport')}
              >
                User Report
              </button>
              <button 
                className={`dashboard-button`}
                onClick={() => setActiveReport('eventReport')}
              >
                Event Report
              </button>
              <button 
                className={`dashboard-button back-button`}
                onClick={navigateToHome}
              >
                Back to Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard-container">
      {renderReport()}
    </div>
  );
};

export default AdminDashboard;