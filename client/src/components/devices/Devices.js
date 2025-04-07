import React, { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import DeviceBorrowConfirmation from "./DeviceBorrowConfirmation";
import DeviceHoldConfirmation from "./DeviceHoldConfirmation";

const Devices = ({ navigateToHome, isLoggedIn, navigateToLogin, userData, initialCategory, navigateToLanding, navigateToAddDevice }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [displayedDevices, setDisplayedDevices] = useState([]);
  const initialRenderRef = useRef(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentAction, setCurrentAction] = useState(null); // "borrow" or "hold"

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

  const navigateToBorrowConfirmation = (device) => {
    setSelectedDevice(device);
    setCurrentAction("borrow");
  };

  const navigateToHoldConfirmation = (device) => {
    setSelectedDevice(device);
    setCurrentAction("hold");
  };

  const handleConfirmBorrow = async () => {
    try {
      const response = await fetch("/api/borrowDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: userData.UserID,
          DeviceID: selectedDevice.DeviceID,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully borrowed "${selectedDevice.Model}".`);
        fetchDevices(); // Refresh devices to update available copies
        setCurrentAction(null); // Return to the device list
      } else {
        alert(`Failed to borrow "${selectedDevice.Model}": ${data.error}`);
        setCurrentAction(null); // Return to the device list
      }
    } catch (error) {
      console.error("Error borrowing device:", error);
      alert("An error occurred while borrowing the device.");
    }
  };

  const handleConfirmHold = async () => {
    try {
      const response = await fetch("/api/holdDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: userData.UserID,
          DeviceID: selectedDevice.DeviceID,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully placed a hold on "${selectedDevice.Model}".`);
        fetchDevices(); // Refresh devices to update available copies
        setCurrentAction(null); // Return to the device list
      } else {
        alert(`Failed to place a hold on "${selectedDevice.Model}": ${data.error}`);
        setCurrentAction(null); // Return to the device list
      }
    } catch (error) {
      console.error("Error placing hold on device:", error);
      alert("An error occurred while placing the hold.");
    }
  };

  return (
    <div className="content-container">
      {currentAction === "borrow" && selectedDevice ? (
        <DeviceBorrowConfirmation
          device={selectedDevice}
          userData={userData}
          handleConfirmBorrow={handleConfirmBorrow}
          navigateToDevices={() => setCurrentAction(null)}
        />
      ) : currentAction === "hold" && selectedDevice ? (
        <DeviceHoldConfirmation
          device={selectedDevice}
          userData={userData}
          handleConfirmHold={handleConfirmHold}
          navigateToDevices={() => setCurrentAction(null)}
        />
      ) : (
        <>
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
                      <button onClick={() => navigateToBorrowConfirmation(device)}>Borrow</button>
                    ) : (
                      <button onClick={() => navigateToHoldConfirmation(device)}>Hold</button>
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
        </>
      )}
    </div>
  );
};

export default Devices;
