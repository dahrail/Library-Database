import React from 'react';
import '../../styles/devices/devices.css';

const DeleteDevice = ({ deviceData, onDeleteDevice, navigateToHome}) => {
  const handleConfirmDelete = () => {
    onDeleteDevice(deviceData.DeviceID);
  };

  const handleDelete = () => {
    onDeleteDevice(deviceData.DeviceID);
  };

  return (
    <div className="content-container">
      <h2>Confirm Delete Device</h2>
      <div className="device-details">
        <p><strong>Type:</strong> {deviceData.Type}</p>
        <p><strong>Brand:</strong> {deviceData.Brand}</p>
        <p><strong>Model:</strong> {deviceData.Model}</p>
        <p><strong>Serial Number:</strong> {deviceData.SerialNumber}</p>
        <p><strong>Total Copies:</strong> {deviceData.TotalCopies}</p>
        <p><strong>Available Copies:</strong> {deviceData.AvailableCopies}</p>
        <p><strong>Shelf Location:</strong> {deviceData.ShelfLocation}</p>
      </div>

      <div className="button-group">
        <button onClick={navigateToHome} className="btn-secondary">Cancel</button>
        <button onClick={handleDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
};

export default DeleteDevice;
