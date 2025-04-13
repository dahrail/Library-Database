import React, { useState } from 'react';
import ItemReport from './ItemReport';
import UserReport from './UserReport';
import EventReport from './EventReport';

const AdminDashboard = ({ navigateToHome }) => {
  const [activeReport, setActiveReport] = useState(null);

  const renderReport = () => {
    switch (activeReport) {
      case 'itemReport':
        return <ItemReport />;
      case 'userReport':
        return <UserReport />;
      case 'eventReport':
        return <EventReport />;
      default:
        return (
          <div>
            <h2>Admin Dashboard</h2>
            <button onClick={() => setActiveReport('itemReport')}>Item Report</button>
            <button onClick={() => setActiveReport('userReport')}>User Report</button>
            <button onClick={() => setActiveReport('eventReport')}>Event Report</button>
            <button onClick={navigateToHome}>Back</button>
          </div>
        );
    }
  };

  return <div>{renderReport()}</div>;
};

export default AdminDashboard;