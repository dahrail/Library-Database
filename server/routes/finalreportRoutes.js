const pool = require("../config/db");
const { sendJsonResponse } = require("../utils/requestUtils");

const itemReport = (req, res) => {
  const query = `
    SELECT 
      i.ItemType,
      i.ItemID,
      i.DisplayTitle,
      i.DisplayAuthor,
      COUNT(DISTINCT l.LoanID) AS TotalBorrows,
      COUNT(DISTINCT CASE WHEN l.ReturnedAt IS NULL THEN l.LoanID END) AS ActiveBorrows,
      COUNT(DISTINCT h.HoldID) AS TotalHolds,
      COUNT(DISTINCT CASE WHEN h.HoldStatus = 'Pending' THEN h.HoldID END) AS PendingHolds
    FROM (
      SELECT 'Book' AS ItemType, BookID AS ItemID, Title AS DisplayTitle, Author AS DisplayAuthor FROM BOOK
      UNION ALL
      SELECT 'Media', MediaID, Title, Author FROM MEDIA
      UNION ALL
      SELECT 'Device', DeviceID, Model AS DisplayTitle, Brand AS DisplayAuthor FROM DEVICE
    ) i
    LEFT JOIN LOAN l ON l.ItemID = i.ItemID AND l.ItemType = i.ItemType
    LEFT JOIN HOLD h ON h.ItemID = i.ItemID AND h.ItemType = i.ItemType
    GROUP BY i.ItemType, i.ItemID, i.DisplayTitle, i.DisplayAuthor
    ORDER BY TotalBorrows DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching item stats report:", err);
      sendJsonResponse(res, 500, {
        success: false,
        error: "Failed to fetch item stats report",
      });
      return;
    }

    sendJsonResponse(res, 200, {
      success: true,
      data: results,
    });
  });
};

module.exports = {
  itemReport,
};
