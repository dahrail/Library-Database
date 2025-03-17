import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FineReport = () => {
  const [fines, setFines] = useState([]);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const response = await axios.get('/api/reports/fines');
        setFines(response.data);
      } catch (error) {
        console.error('Error fetching fine report:', error);
      }
    };

    fetchFines();
  }, []);

  return (
    <div className="container">
      <h2>Fine Report</h2>
      <table className="table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>Item ID</th>
            <th>Item Title</th>
            <th>Days Late</th>
            <th>Fine Amount</th>
          </tr>
        </thead>
        <tbody>
          {fines.map((fine) => (
            <tr key={fine.id}>
              <td>{fine.userId}</td>
              <td>{fine.userName}</td>
              <td>{fine.itemId}</td>
              <td>{fine.itemTitle}</td>
              <td>{fine.daysLate}</td>
              <td>${fine.fineAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FineReport;