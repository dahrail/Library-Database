import React, { useEffect, useState } from 'react';

const UserReport = () => {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserReport = async () => {
      try {
        const response = await fetch('/api/userReport');
        const data = await response.json();
        if (data.success) {
          setReportData(data.data);
        } else {
          console.error('Failed to fetch user report:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserReport();
  }, []);

  return (
    <div className="user-report">
      <h3>User Loan Report</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Item Type</th>
              <th>Title/Model</th>
              <th>Author/Brand</th>
              <th>Loan ID</th>
              <th>Borrowed At</th>
              <th>Due At</th>
              <th>Returned At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.UserID}</td>
                <td>{item.FirstName}</td>
                <td>{item.LastName}</td>
                <td>{item.Role}</td>
                <td>{item.ItemType}</td>
                <td>{item.Title}</td>
                <td>{item.Author}</td>
                <td>{item.LoanID}</td>
                <td>{item.BorrowedAt ? new Date(item.BorrowedAt).toLocaleDateString() : '-'}</td>
                <td>{item.DueAT ? new Date(item.DueAT).toLocaleDateString() : '-'}</td>
                <td>{item.ReturnedAt ? new Date(item.ReturnedAt).toLocaleDateString() : 'Not Returned'}</td>
                <td>{item.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserReport;
