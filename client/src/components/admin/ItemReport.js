import React, { useEffect, useState } from 'react';

const ItemReport = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Input fields (user input before "Generate Report")
  const [itemTypeInput, setItemTypeInput] = useState('All');
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [sortByInput, setSortByInput] = useState('none');
  const [sortOrderInput, setSortOrderInput] = useState('asc');
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  // Filters applied when "Generate Report" is clicked
  const [itemTypeFilter, setItemTypeFilter] = useState('All');
  const [titleSearch, setTitleSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [sortOrder, setSortOrder] = useState('asc');

  // Apply filters
  const applyFilters = async () => {
    setItemTypeFilter(itemTypeInput);
    setTitleSearch(titleInput);
    setAuthorSearch(authorInput);
    setSortBy(sortByInput);
    setSortOrder(sortOrderInput);
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (startDateInput) params.append('startDate', startDateInput);
      if (endDateInput) params.append('endDate', endDateInput);

      console.log("Query parameters being sent:", params.toString());


      const response = await fetch(`/api/itemReport?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setReportData(data.data);
      } else {
        console.error('Failed to fetch item report:', data.error);
      }
    } catch (error) {
      console.error('Error fetching item report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    applyFilters(); // Initial fetch (all data)
  }, []);

  useEffect(() => {
    let filtered = [...reportData];

    // Apply filters
    if (itemTypeFilter !== 'All') {
      filtered = filtered.filter(item => item.ItemType === itemTypeFilter);
    }

    if (titleSearch) {
      filtered = filtered.filter(item =>
        item.DisplayTitle.toLowerCase().includes(titleSearch.toLowerCase())
      );
    }

    if (authorSearch) {
      filtered = filtered.filter(item =>
        item.DisplayAuthor.toLowerCase().includes(authorSearch.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy !== 'none') {
      filtered.sort((a, b) => {
        const aValue = sortBy === 'TotalBorrows' ? a.TotalBorrows : a.TotalHolds;
        const bValue = sortBy === 'TotalBorrows' ? b.TotalBorrows : b.TotalHolds;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    setFilteredData(filtered);
  }, [itemTypeFilter, titleSearch, authorSearch, sortBy, sortOrder, reportData]);

  return (
    <div className="item-report">
      <h3>Item Report</h3>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <label>
          Item Type:&nbsp;
          <select value={itemTypeInput} onChange={e => setItemTypeInput(e.target.value)}>
            <option value="All">All</option>
            <option value="Book">Book</option>
            <option value="Media">Media</option>
            <option value="Device">Device</option>
          </select>
        </label>

        <label>
          Title/Model:&nbsp;
          <input
            type="text"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            placeholder="Search by title or model"
          />
        </label>

        <label>
          Author/Brand:&nbsp;
          <input
            type="text"
            value={authorInput}
            onChange={e => setAuthorInput(e.target.value)}
            placeholder="Search by author or brand"
          />
        </label>

        <label>
          Start Date:&nbsp;
          <input
            type="date"
            value={startDateInput}
            onChange={e => setStartDateInput(e.target.value)}
          />
        </label>

        <label>
          End Date:&nbsp;
          <input
            type="date"
            value={endDateInput}
            onChange={e => setEndDateInput(e.target.value)}
          />
        </label>

        <label>
          Sort by:&nbsp;
          <select value={sortByInput} onChange={e => setSortByInput(e.target.value)}>
            <option value="none">None</option>
            <option value="TotalBorrows">Total Borrows</option>
            <option value="TotalHolds">Total Holds</option>
          </select>
        </label>

        <label>
          Order:&nbsp;
          <select
            value={sortOrderInput}
            onChange={e => setSortOrderInput(e.target.value)}
            disabled={sortByInput === 'none'}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <button onClick={applyFilters} style={{ height: 'fit-content', padding: '0.5rem 1rem' }}>
          Generate Report
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Item ID</th>
              <th>Title/Model</th>
              <th>Author/Brand</th>
              <th>Total Borrows</th>
              <th>Active Borrows</th>
              <th>Total Holds</th>
              <th>Pending Holds</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr><td colSpan="8">No results found.</td></tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.ItemType}</td>
                  <td>{item.ItemID}</td>
                  <td>{item.DisplayTitle}</td>
                  <td>{item.DisplayAuthor}</td>
                  <td>{item.TotalBorrows}</td>
                  <td>{item.ActiveBorrows}</td>
                  <td>{item.TotalHolds}</td>
                  <td>{item.PendingHolds}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ItemReport;
