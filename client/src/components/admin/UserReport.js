import React, { useEffect, useState } from 'react';

const UserReport = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Live input fields (unapplied filters)
  const [roleInput, setRoleInput] = useState('');
  const [itemTypeInput, setItemTypeInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');

  // Actual applied filters (used to filter data)
  const [roleFilter, setRoleFilter] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');

  useEffect(() => {
    const fetchUserReport = async () => {
      try {
        const response = await fetch('/api/userReport');
        const data = await response.json();
        if (data.success) {
          setReportData(data.data);
          setFilteredData(data.data);
        } else {
          console.error('Failed to fetch user report:', data.error);
        }
      } catch (error) {
        console.error('Error fetching user report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserReport();
  }, []);

  useEffect(() => {
    let filtered = reportData;

    if (roleFilter) {
      filtered = filtered.filter(item => item.Role === roleFilter);
    }
    if (itemTypeFilter) {
      filtered = filtered.filter(item => item.ItemType === itemTypeFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter(item => item.Status === statusFilter);
    }
    if (firstNameFilter) {
      filtered = filtered.filter(item =>
        item.FirstName?.toLowerCase().includes(firstNameFilter.toLowerCase())
      );
    }
    if (lastNameFilter) {
      filtered = filtered.filter(item =>
        item.LastName?.toLowerCase().includes(lastNameFilter.toLowerCase())
      );
    }
    if (titleFilter) {
      filtered = filtered.filter(item =>
        item.Title?.toLowerCase().includes(titleFilter.toLowerCase())
      );
    }
    if (authorFilter) {
      filtered = filtered.filter(item =>
        item.Author?.toLowerCase().includes(authorFilter.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [
    roleFilter,
    itemTypeFilter,
    statusFilter,
    firstNameFilter,
    lastNameFilter,
    titleFilter,
    authorFilter,
    reportData
  ]);

  const uniqueRoles = [...new Set(reportData.map(item => item.Role))];
  const uniqueItemTypes = [...new Set(reportData.map(item => item.ItemType))];
  const uniqueStatuses = [...new Set(reportData.map(item => item.Status))];

  // When user clicks Generate Report
  const applyFilters = () => {
    setRoleFilter(roleInput);
    setItemTypeFilter(itemTypeInput);
    setStatusFilter(statusInput);
    setFirstNameFilter(firstNameInput);
    setLastNameFilter(lastNameInput);
    setTitleFilter(titleInput);
    setAuthorFilter(authorInput);
  };

  return (
    <div className="user-report">
      <h3>User Loan Report</h3>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <label>
          Role:
          <select value={roleInput} onChange={e => setRoleInput(e.target.value)}>
            <option value="">All</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </label>

        <label>
          Item Type:
          <select value={itemTypeInput} onChange={e => setItemTypeInput(e.target.value)}>
            <option value="">All</option>
            {uniqueItemTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label>
          Status:
          <select value={statusInput} onChange={e => setStatusInput(e.target.value)}>
            <option value="">All</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <label>
          First Name:
          <input
            type="text"
            value={firstNameInput}
            onChange={e => setFirstNameInput(e.target.value)}
            placeholder="Search First Name"
          />
        </label>

        <label>
          Last Name:
          <input
            type="text"
            value={lastNameInput}
            onChange={e => setLastNameInput(e.target.value)}
            placeholder="Search Last Name"
          />
        </label>

        <label>
          Title/Model:
          <input
            type="text"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            placeholder="Search Title"
          />
        </label>

        <label>
          Author/Brand:
          <input
            type="text"
            value={authorInput}
            onChange={e => setAuthorInput(e.target.value)}
            placeholder="Search Author"
          />
        </label>

        <button onClick={applyFilters} style={{ height: 'fit-content', padding: '0.5rem 1rem' }}>
          Generate Report
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Item Type</th>
              <th>Title/Model</th>
              <th>Author/Brand</th>
              <th>Loan ID</th>
              <th>Borrowed At</th>
              <th>Due At</th>
              <th>Returned At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr><td colSpan="12">No results found.</td></tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.UserID}</td>
                  <td>{item.FirstName}</td>
                  <td>{item.LastName}</td>
                  <td>{item.Role}</td>
                  <td>{item.ItemType}</td>
                  <td>{item.Title}</td>
                  <td>{item.Author}</td>
                  <td>{item.LoanID}</td>
                  <td>{item.BorrowedAt ? new Date(item.BorrowedAt).toLocaleDateString() : '-'}</td>
                  <td>{item.DueAT ? new Date(item.DueAT).toLocaleDateString() : '-'}</td>
                  <td>{item.ReturnedAt ? new Date(item.ReturnedAt).toLocaleDateString() : 'Not Returned'}</td>
                  <td>{item.Status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserReport;
