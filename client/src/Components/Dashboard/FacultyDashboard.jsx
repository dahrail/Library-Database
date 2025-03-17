import React from 'react';
import { Link } from 'react-router-dom';

function FacultyDashboard() {
  return (
    <div className="container">
      <h1>Faculty Dashboard</h1>
      <p>Welcome to the Faculty Dashboard. Here you can manage your library activities.</p>
      <div className="dashboard-links">
        <Link to="/books" className="btn btn-primary">View Books</Link>
        <Link to="/borrowings" className="btn btn-primary">Manage Borrowings</Link>
        <Link to="/reports" className="btn btn-primary">View Reports</Link>
      </div>
    </div>
  );
}

export default FacultyDashboard;