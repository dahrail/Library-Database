import React, { useState } from 'react';

const ReportsDashboard = ({ reportData, isLoading }) => {
  const [reportType, setReportType] = useState('checkouts');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 30 days ago
    endDate: new Date().toISOString().slice(0, 10) // today
  });

  // Mock data for demonstration
  const mockReportData = {
    checkouts: {
      daily: [
        { date: '2023-11-01', count: 12 },
        { date: '2023-11-02', count: 15 },
        { date: '2023-11-03', count: 8 },
        { date: '2023-11-04', count: 20 },
        { date: '2023-11-05', count: 25 },
      ],
      popular: [
        { title: 'The Great Gatsby', checkouts: 32 },
        { title: 'To Kill a Mockingbird', checkouts: 28 },
        { title: '1984', checkouts: 25 },
        { title: 'Pride and Prejudice', checkouts: 22 },
        { title: 'The Catcher in the Rye', checkouts: 18 }
      ]
    },
    users: {
      new: [
        { date: '2023-11-01', count: 3 },
        { date: '2023-11-02', count: 5 },
        { date: '2023-11-03', count: 2 },
        { date: '2023-11-04', count: 7 },
        { date: '2023-11-05', count: 4 },
      ],
      active: [
        { username: 'jsmith', checkouts: 12, lastActive: '2023-11-05' },
        { username: 'mjohnson', checkouts: 8, lastActive: '2023-11-04' },
        { username: 'rwilliams', checkouts: 7, lastActive: '2023-11-05' },
        { username: 'dbrown', checkouts: 6, lastActive: '2023-11-03' },
        { username: 'tgray', checkouts: 5, lastActive: '2023-11-05' }
      ]
    },
    fines: {
      collected: [
        { date: '2023-11-01', amount: 25.50 },
        { date: '2023-11-02', amount: 32.75 },
        { date: '2023-11-03', amount: 15.00 },
        { date: '2023-11-04', amount: 42.25 },
        { date: '2023-11-05', amount: 18.50 },
      ],
      outstanding: [
        { username: 'mjohnson', amount: 12.50, dueDate: '2023-11-15' },
        { username: 'tgray', amount: 8.75, dueDate: '2023-11-12' },
        { username: 'dbrown', amount: 5.00, dueDate: '2023-11-10' },
        { username: 'rwilliams', amount: 15.25, dueDate: '2023-11-20' },
        { username: 'jsmith', amount: 3.50, dueDate: '2023-11-08' }
      ]
    }
  };

  // Check if reportData has the expected structure before using it
  const data = reportData && 
               reportData.checkouts && 
               reportData.users && 
               reportData.fines ? reportData : mockReportData;

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReport = () => {
    // This would be an API call in a real implementation
    console.log('Generating report for:', reportType, dateRange);
    // For now, we'll just use the mock data
  };

  const renderReportContent = () => {
    switch (reportType) {
      case 'checkouts':
        return (
          <div className="report-content">
            <div className="report-section">
              <h4>Daily Checkouts</h4>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Number of Checkouts</th>
                  </tr>
                </thead>
                <tbody>
                  {data.checkouts && data.checkouts.daily && data.checkouts.daily.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="report-section">
              <h4>Most Popular Books</h4>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Number of Checkouts</th>
                  </tr>
                </thead>
                <tbody>
                  {data.checkouts && data.checkouts.popular && data.checkouts.popular.map((item, index) => (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{item.checkouts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div className="report-content">
            <div className="report-section">
              <h4>New User Registrations</h4>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Number of New Users</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users && data.users.new && data.users.new.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="report-section">
              <h4>Most Active Users</h4>
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Checkouts</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users && data.users.active && data.users.active.map((item, index) => (
                    <tr key={index}>
                      <td>{item.username}</td>
                      <td>{item.checkouts}</td>
                      <td>{item.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'fines':
        return (
          <div className="report-content">
            <div className="report-section">
              <h4>Fines Collected</h4>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fines && data.fines.collected && data.fines.collected.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="report-section">
              <h4>Outstanding Fines</h4>
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Amount ($)</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fines && data.fines.outstanding && data.fines.outstanding.map((item, index) => (
                    <tr key={index}>
                      <td>{item.username}</td>
                      <td>${item.amount.toFixed(2)}</td>
                      <td>{item.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      default:
        return <div>Select a report type to view data.</div>;
    }
  };

  return (
    <div className="reports-dashboard">
      <h3>Reports Dashboard</h3>
      
      <div className="report-controls">
        <div className="control-group">
          <label>Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="checkouts">Book Checkouts</option>
            <option value="users">User Activity</option>
            <option value="fines">Fines and Payments</option>
          </select>
        </div>
        
        <div className="date-range">
          <div className="control-group">
            <label>Start Date</label>
            <input 
              type="date" 
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>End Date</label>
            <input 
              type="date" 
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
            />
          </div>
        </div>
        
        <button onClick={generateReport}>Generate Report</button>
      </div>
      
      {isLoading ? (
        <div className="loading">Loading report data...</div>
      ) : (
        <div className="report-container">
          {renderReportContent()}
        </div>
      )}
    </div>
  );
};

export default ReportsDashboard;
