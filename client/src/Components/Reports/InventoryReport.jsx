import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InventoryReport() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('/api/reports/inventory');
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory report:', error);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="container">
      <h2>Library Inventory Report</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Type</th>
            <th>Available Copies</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.type}</td>
              <td>{item.availableCopies}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryReport;