import React, { useState, useEffect } from "react";
import "../../styles/admin/AdminReports.css";

const AdminReports = ({ navigateToHome }) => {
  const [reportType, setReportType] = useState("popularBooks");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/adminReports?reportType=${reportType}`
      );
      const data = await response.json();

      if (data.success) {
        setReportData(data.data);
      } else {
        setError(data.error || "Failed to fetch report data.");
      }
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("An error occurred while fetching the report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const renderTable = () => {
    if (reportData.length === 0) {
      return <p>No data available for this report.</p>;
    }

    return (
      <table className="admin-report-table">
        <thead>
          <tr>
            {Object.keys(reportData[0]).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="admin-reports-container">
      <h2>Admin Reports</h2>

      <div className="filter-container">
        <label htmlFor="reportType">Select Report: </label>
        <select
          id="reportType"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="popularBooks">Most Popular Books</option>
          <option value="activeUsers">Most Active Users</option>
          <option value="finesCollected">Fines Collected</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        renderTable()
      )}

      <button onClick={navigateToHome} className="btn-back">
        Back to Home
      </button>
    </div>
  );
};

export default AdminReports;
