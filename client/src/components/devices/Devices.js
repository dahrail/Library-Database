import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";

const Devices = ({ navigateToHome, isLoggedIn, navigateToLogin, userData, initialCategory, navigateToLanding, navigateToAddDevice }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [displayedDevices, setDisplayedDevices] = useState([]);
  const initialRenderRef = useRef(true);

  // Fetch devices from the backend
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await API.getDevices();
      if (data.success) {
        setDevices(data.devices);

        // Extract unique categories from devices
        const uniqueCategories = [...new Set(data.devices.map((device) => device.Type))];
        setCategories(["all", ...uniqueCategories]);
      } else {
        setError(data.error || "Failed to fetch devices");
      }
    } catch (err) {
      console.error("Error fetching devices:", err);
      setError("An error occurred while fetching devices");
    } finally {
      setLoading(false);
    }
  };

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, []);

  // Use the initialCategory prop on mount
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Filter devices by category
  useEffect(() => {
    if (devices.length > 0) {
      let filtered = [...devices];
      if (selectedCategory !== "all") {
        filtered = filtered.filter((device) => device.Type === selectedCategory);
      }
      setDisplayedDevices(filtered);

      // Trigger animation on category change
      if (!initialRenderRef.current) {
        const container = document.querySelector("#devices-grid");
        if (container) {
          container.classList.remove("fade-in-items");
          void container.offsetWidth; // Force reflow
          container.classList.add("fade-in-items");
        }
      } else {
        initialRenderRef.current = false;
      }
    }
  }, [selectedCategory, devices]);

  // Handle borrowing a device
  const handleBorrow = async (device) => {
    try {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: userData.UserID,
          ItemType: "Device",
          ItemID: device.DeviceID,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully borrowed "${device.Model}".`);
        fetchDevices(); // Refresh devices to update available copies
      } else {
        alert(`Failed to borrow "${device.Model}": ${data.error}`);
      }
    } catch (error) {
      console.error("Error borrowing device:", error);
      alert("An error occurred while borrowing the device.");
    }
  };

  return (
    <div className="content-container">
      <h2>Devices Collection</h2>

      {/* Show "Add Device" button for admins */}
      {isLoggedIn && userData?.Role === "Admin" && (
        <button onClick={navigateToAddDevice} className="btn-primary">
          Add Device
        </button>
      )}

      {/* Category Filter */}
      <div className="category-filter">
        <label htmlFor="category-select">Filter by Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Device List */}
      {loading ? (
        <p>Loading devices...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div id="devices-grid" className="fade-in-items">
          {displayedDevices.map((device) => (
            <div key={device.DeviceID} className="device-card">
              <h3>{device.Model}</h3>
              <p>Type: {device.Type}</p>
              <p>Brand: {device.Brand}</p>
              {isLoggedIn ? (
                device.AvailableCopies > 0 ? (
                  <button onClick={() => handleBorrow(device)}>Borrow</button>
                ) : (
                  <button disabled>Out of Stock</button>
                )
              ) : (
                <button onClick={navigateToLogin}>Login to Borrow</button>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={isLoggedIn ? navigateToHome : navigateToLanding} className="btn-back">
        Back to Home
      </button>
    </div>
  );
};

export default Devices;
