const pool = require("../config/db");
const { sendJsonResponse, parseRequestBody } = require("../utils/requestUtils");

// Get all device items with inventory information
const getAllDevice = (req, res) => {
  console.log("Fetching all device items");

  const query = `
    SELECT 
      D.DeviceID, 
      D.Type,
      D.Brand, 
      D.Model, 
      D.SerialNumber,
      I.TotalCopies, 
      I.AvailableCopies,
      I.ShelfLocation
    FROM DEVICE AS D
    JOIN DEVICE_INVENTORY AS I ON D.DeviceID = I.DeviceID
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing device query:", err);
      sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
      return;
    }

    console.log("Query executed successfully. Results:", results);
    sendJsonResponse(res, 200, { success: true, devices: results });
  });
};

// Add a new device
const addDevice = async (req, res) => {
  try {
    const deviceData = await parseRequestBody(req); // Correctly parse the request body
    console.log("Adding new device:", deviceData);

    const {
      Type,
      Brand,
      Model,
      SerialNumber,
      TotalCopies,
      AvailableCopies,
      ShelfLocation,
    } = deviceData;

    const query =
      "INSERT INTO DEVICE (Type,Brand, Model, SerialNumber) VALUES (?, ?, ?, ?)";
    pool.query(
      query,
      [Type,Brand, Model, SerialNumber],
      (err, results) => {
        if (err) {
          console.error("Error adding device:", err);
          sendJsonResponse(res, 500, { success: false, error: "Database error" });
          return;
        }

        const DeviceID = results.insertId;
        const inventoryQuery =
          "INSERT INTO DEVICE_INVENTORY (DeviceID, TotalCopies, AvailableCopies, ShelfLocation) VALUES (?, ?, ?, ?)";
        pool.query(
          inventoryQuery,
          [DeviceID, TotalCopies, AvailableCopies, ShelfLocation],
          (err) => {
            if (err) {
              console.error("Error updating inventory:", err);
              sendJsonResponse(res, 500, { success: false, error: "Failed to update inventory" });
              return;
            }
            sendJsonResponse(res, 200, { success: true, DeviceID });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in addDevice:", error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

module.exports = {
  getAllDevice,
  addDevice,
};
