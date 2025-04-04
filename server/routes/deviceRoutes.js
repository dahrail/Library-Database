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

const borrowDevice = async (req, res) => {
  try {
    const { UserID, DeviceID } = await parseRequestBody(req);

    // Check if the device is available
    const checkQuery = "SELECT AvailableCopies FROM DEVICE_INVENTORY WHERE DeviceID = ?";
    const [rows] = await pool.promise().query(checkQuery, [DeviceID]);

    if (rows.length === 0 || rows[0].AvailableCopies == 0) {
      return sendJsonResponse(res, 400, { success: false, error: "Device is not available for borrowing." });
    }

    // Determine loan period based on user role
    const roleQuery = `SELECT Role FROM USER WHERE UserID = ?`;
    const [user] = await pool.promise().query(roleQuery, [UserID]);
    const role = user[0]?.Role || "Student";
    const loanPeriod = role === "Student" ? 7 : 14;

    // Update inventory
    const updateQuery = "UPDATE DEVICE_INVENTORY SET AvailableCopies = AvailableCopies - 1 WHERE DeviceID = ?";
    await pool.promise().query(updateQuery, [DeviceID]);

    // Add entry to Loan table
    const loanQuery = `
      INSERT INTO LOAN (UserID, ItemType, ItemID, BorrowedAt, DueAt)
      VALUES (?, 'Device', ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))
    `;
    await pool.promise().query(loanQuery, [UserID, DeviceID,loanPeriod]);

    sendJsonResponse(res, 200, { success: true });
  } catch (error) {
    console.error("Error borrowing device:", error);
    sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
  }
};

const holdDevice = async (req, res) => {
  try {
    const { UserID, DeviceID } = await parseRequestBody(req);

    // Add entry to Hold table
    const holdQuery = `
      INSERT INTO HOLD (UserID, ItemType, ItemID, RequestAt, HoldStatus)
      VALUES (?, 'Device', ?, NOW(), 'Pending')
    `;
    await pool.promise().query(holdQuery, [UserID, DeviceID]);

    sendJsonResponse(res, 200, { success: true });
  } catch (error) {
    console.error("Error placing hold on device:", error);
    sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
  }
};

const returnDevice = async (req, res) => {
  try {
    const { UserID, DeviceID } = await parseRequestBody(req);

    // Update inventory
    const updateQuery = "UPDATE DEVICE_INVENTORY SET AvailableCopies = AvailableCopies + 1 WHERE DeviceID = ?";
    await pool.promise().query(updateQuery, [DeviceID]);

    // Delete entry from Loan table
    const deleteQuery = "DELETE FROM LOAN WHERE UserID = ? AND ItemType = 'Device' AND ItemID = ?";
    await pool.promise().query(deleteQuery, [UserID, DeviceID]);

    sendJsonResponse(res, 200, { success: true });
  } catch (error) {
    console.error("Error returning device:", error);
    sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
  }
};

module.exports = {
  getAllDevice,
  addDevice,
  borrowDevice,
  holdDevice,
  returnDevice,
};
