import React, { useState } from 'react';
import ItemReport from './ItemReport';
import UserReport from './UserReport';
import EventReport from './EventReport';
import '../../styles/admin/AdminDashboard.css';
import '../../styles/admin/ReportCards.css';

const AdminDashboard = ({ navigateToHome }) => {
  const [activeReport, setActiveReport] = useState(null);
  
  // Wikipedia image URLs for each report type
  const wikipediaImageUrls = {
    itemReport: "https://remsoft.com/wp-content/uploads/2024/11/Report-database-SQL-Woodstock.jpg",
    userReport: "https://remsoft.com/wp-content/uploads/2024/11/Report-database-SQL-Woodstock.jpg",
    eventReport: "https://remsoft.com/wp-content/uploads/2024/11/Report-database-SQL-Woodstock.jpg"
  };

  // Navigation function to go back to reports dashboard
  const navigateBackToReports = () => {
    setActiveReport(null);
  };

  const renderReport = () => {
    switch (activeReport) {
      case 'itemReport':
      case 'userReport':
      case 'eventReport':
        return (
          <div className="reports-container">
            <div className="reports-navigation">
              <button 
                className="report-nav-button back-button" 
                onClick={() => setActiveReport(null)}
              >
                Back to Reports
              </button>
            </div>
            
            <div className="report-content">
              {activeReport === 'itemReport' && <ItemReport navigateBack={navigateBackToReports} />}
              {activeReport === 'userReport' && <UserReport navigateBack={navigateBackToReports} />}
              {activeReport === 'eventReport' && <EventReport navigateBack={navigateBackToReports} />}
            </div>
          </div>
        );
      default:
        return (
          <div className="admin-dashboard">
            <h2>Library Reports Dashboard</h2>
            
            <div className="reports-cards-container">
              <div 
                className="report-card" 
                onClick={() => setActiveReport('itemReport')}
              >
                <div className="report-card-image">
                  <img 
                    src={wikipediaImageUrls.itemReport} 
                    alt="Item Report" 
                  />
                  <div className="report-card-overlay"></div>
                </div>
                <div className="report-card-content">
                  <h3>Item Report</h3>
                  <p>Track book, media, and device usage statistics including borrows and holds</p>
                </div>
              </div>
              
              <div 
                className="report-card" 
                onClick={() => setActiveReport('userReport')}
              >
                <div className="report-card-image">
                  <img 
                    src={wikipediaImageUrls.userReport} 
                    alt="User Report" 
                  />
                  <div className="report-card-overlay"></div>
                </div>
                <div className="report-card-content">
                  <h3>User Report</h3>
                  <p>Analyze user activity, loan history, and borrowing patterns</p>
                </div>
              </div>
              
              <div 
                className="report-card" 
                onClick={() => setActiveReport('eventReport')}
              >
                <div className="report-card-image">
                  <img 
                    src={wikipediaImageUrls.eventReport} 
                    alt="Event Report" 
                  />
                  <div className="report-card-overlay"></div>
                </div>
                <div className="report-card-content">
                  <h3>Event Report</h3>
                  <p>Monitor event attendance, check-in rates, and room utilization</p>
                </div>
              </div>
            </div>
            
            <div className="back-home-container">
              <button 
                className="btn-back"
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