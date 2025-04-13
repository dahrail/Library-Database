import React, { useEffect, useState } from 'react';

const ItemReport = () => {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItemReport = async () => {
      try {
        const response = await fetch('/api/itemReport');
        const data = await response.json();
        if (data.success) {
          setReportData(data.data);
        } else {
          console.error('Failed to fetch item report:', data.error);
        }
      } catch (error) {
        console.error('Error fetching item report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemReport();
  }, []);

  return (
    <div className="item-report">
      <h3>Item Report</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Item ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Total Borrows</th>
              <th>Active Borrows</th>
              <th>Total Holds</th>
              <th>Pending Holds</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.ItemType}</td>
                <td>{item.ItemID}</td>
                <td>{item.DisplayTitle}</td>
                <td>{item.DisplayAuthor}</td>
                <td>{item.TotalBorrows}</td>
                <td>{item.ActiveBorrows}</td>
                <td>{item.TotalHolds}</td>
                <td>{item.PendingHolds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ItemReport;