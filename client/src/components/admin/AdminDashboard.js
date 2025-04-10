import React, { useState, useEffect } from 'react';
import UserManagement from './UserManagement';
import BookManagement from './BookManagement';
import BorrowingStatusManagement from './BorrowingStatusManagement';
import SystemSettings from './SystemSettings';
import ReportsDashboard from './ReportsDashboard';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('reports');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load initial reports data
    fetchReportData();
  }, []);
  
  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dataReport');
      const data = await response.json();
      
      if (data.success) {
        setReportData(data.data);
      } else {
        console.error('Failed to load report data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-nav">
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'books' ? 'active' : ''}
          onClick={() => setActiveTab('books')}
        >
          Book Management
        </button>
        <button 
          className={activeTab === 'borrowing' ? 'active' : ''}
          onClick={() => setActiveTab('borrowing')}
        >
          Borrowing Management
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          System Settings
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'reports' && <ReportsDashboard reportData={reportData} isLoading={isLoading} />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'books' && <BookManagement />}
        {activeTab === 'borrowing' && <BorrowingStatusManagement />}
        {activeTab === 'settings' && <SystemSettings />}
      </div>
    </div>
  );
};

export default AdminDashboard;
