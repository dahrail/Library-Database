import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import '../../styles/devices/devices.css';

const UpdateDeviceList = ({ navigateToHome, navigateToUpdateDevice }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await API.getDevices();
        if (data.success) {
          setDevices(data.devices);
        } else {
          setError(data.error || 'Failed to fetch devices');
        }
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('An error occurred while fetching devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  return (
    <div className="content-container">
      <h2>Update Devices</h2>
      {loading ? (
        <p>Loading devices...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table className="device-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Serial Number</th>
              <th>Total Copies</th>
              <th>Available Copies</th>
              <th>Shelf Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.DeviceID}>
                <td>{device.Type}</td>
                <td>{device.Brand}</td>
                <td>{device.Model}</td>
                <td>{device.SerialNumber}</td>
                <td>{device.TotalCopies}</td>
                <td>{device.AvailableCopies}</td>
                <td>{device.ShelfLocation}</td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => navigateToUpdateDevice(device)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={navigateToHome} className="btn-secondary">
        Back to Home
      </button>
    </div>
  );
};

export default UpdateDeviceList;