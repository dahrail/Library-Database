import React, { useState } from "react";
import "../../styles/loans/Loans.css";

const LoanList = ({ loans, handleReturn, navigateToHome }) => {
  const [selectedItemType, setSelectedItemType] = useState("All");
  const [returnFilter, setReturnFilter] = useState("All");

  if (!Array.isArray(loans)) {
    return (
      <div className="content-container">
        <h2>Your Loans</h2>
        <p>Unable to display loans. Please try again later.</p>
        <button onClick={navigateToHome} className="btn-back">
          Back to Home
        </button>
      </div>
    );
  }

  const sortedLoans = loans.sort(
    (a, b) => new Date(b.BorrowedAt) - new Date(a.BorrowedAt)
  );

  const itemTypes = ["All", ...new Set(loans.map((loan) => loan.ItemType))];

  const filteredLoans = sortedLoans.filter((loan) => {
    const matchesType =
      selectedItemType === "All" || loan.ItemType === selectedItemType;

    const matchesReturnStatus =
      returnFilter === "All" ||
      (returnFilter === "Returned" && loan.ReturnedAt) ||
      (returnFilter === "Not Returned" && !loan.ReturnedAt);

    return matchesType && matchesReturnStatus;
  });

  return (
    <div className="content-container">
      <h2>Your Loans</h2>

      {/* Filters */}
      <div className="filter-container">
        <label htmlFor="typeFilter">Item Type: </label>
        <select
          id="typeFilter"
          value={selectedItemType}
          onChange={(e) => setSelectedItemType(e.target.value)}
        >
          {itemTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="returnFilter" style={{ marginLeft: "1rem" }}>
          Return Status:{" "}
        </label>
        <select
          id="returnFilter"
          value={returnFilter}
          onChange={(e) => setReturnFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Returned">Returned</option>
          <option value="Not Returned">Not Returned</option>
        </select>
      </div>

      {filteredLoans.length === 0 ? (
        <p>No matching loan records found.</p>
      ) : (
        <table className="loans-table">
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Title/Model</th>
              <th>Author/Brand</th>
              <th>Borrowed At</th>
              <th>Due At</th>
              <th>Returned At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan, index) => (
              <tr key={index}>
                <td>{loan.ItemType}</td>
                <td>{loan.Title}</td>
                <td>{loan.AuthorOrBrand}</td>
                <td>{new Date(loan.BorrowedAt).toLocaleString()}</td>
                <td>{new Date(loan.DueAT).toLocaleString()}</td>
                <td>
                  {loan.ReturnedAt
                    ? new Date(loan.ReturnedAt).toLocaleString()
                    : "Not Returned"}
                </td>
                <td>
                  <button
                    onClick={() => handleReturn(loan)}
                    className={loan.ReturnedAt ? "btn-disabled" : "btn-return"}
                    disabled={!!loan.ReturnedAt}
                  >
                    {loan.ReturnedAt ? "Returned" : "Return"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={navigateToHome} className="btn-back">
        Back to Home
      </button>
    </div>
  );
};

export default LoanList;
