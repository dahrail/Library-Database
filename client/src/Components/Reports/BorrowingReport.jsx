import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BorrowingReport() {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('/reports/borrowing');
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching borrowing report data:', error);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div className="container">
      <h2>Borrowing Report</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>User ID</th>
            <th>User Role</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item) => (
            <tr key={item.id}>
              <td>{item.itemId}</td>
              <td>{item.itemName}</td>
              <td>{item.userId}</td>
              <td>{item.userRole}</td>
              <td>{item.borrowDate}</td>
              <td>{item.returnDate}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BorrowingReport;