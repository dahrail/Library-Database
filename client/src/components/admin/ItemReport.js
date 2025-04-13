import React, { useEffect, useState } from 'react';

const ItemReport = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [itemTypeFilter, setItemTypeFilter] = useState('All');
  const [titleSearch, setTitleSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');

  // New state for sorting: "none", "TotalBorrows", "TotalHolds"
  const [sortBy, setSortBy] = useState('none'); 
  // New state for sorting order: "asc", "desc"
  const [sortOrder, setSortOrder] = useState('asc'); 

  useEffect(() => {
    const fetchItemReport = async () => {
      try {
        const response = await fetch('/api/itemReport');
        const data = await response.json();
        if (data.success) {
          setReportData(data.data);
          setFilteredData(data.data);
        } else {
          console.error('Failed to fetch item report:', data.error);
        }
      } catch (error) {
        console.error('Error fetching item report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemReport();
  }, []);

  useEffect(() => {
    let filtered = [...reportData];

    // Filter by Item Type, Title, and Author as before
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

    // Apply sorting based on the selected criteria (Total Borrows or Total Holds)
    if (sortBy !== 'none') {
      filtered.sort((a, b) => {
        const aValue = sortBy === 'TotalBorrows' ? a.TotalBorrows : a.TotalHolds;
        const bValue = sortBy === 'TotalBorrows' ? b.TotalBorrows : b.TotalHolds;

        return sortOrder === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      });
    }

    setFilteredData(filtered);
  }, [itemTypeFilter, titleSearch, authorSearch, reportData, sortBy, sortOrder]);

  return (
    <div className="item-report">
      <h3>Item Report</h3>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: '1rem' }}>
        <label>
          Item Type:&nbsp;
          <select value={itemTypeFilter} onChange={e => setItemTypeFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Book">Book</option>
            <option value="Media">Media</option>
            <option value="Device">Device</option>
          </select>
        </label>

        &nbsp;&nbsp;

        <label>
          Title/Model:&nbsp;
          <input
            type="text"
            value={titleSearch}
            onChange={e => setTitleSearch(e.target.value)}
            placeholder="Search by title..."
          />
        </label>

        &nbsp;&nbsp;

        <label>
          Author/Brand:&nbsp;
          <input
            type="text"
            value={authorSearch}
            onChange={e => setAuthorSearch(e.target.value)}
            placeholder="Search by author..."
          />
        </label>

        &nbsp;&nbsp;

        {/* Sorting Criteria Dropdown */}
        <label>
          Sort by:&nbsp;
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="none">None</option>
            <option value="TotalBorrows">Total Borrows</option>
            <option value="TotalHolds">Total Holds</option>
          </select>
        </label>

        &nbsp;&nbsp;

        {/* Sorting Order Dropdown */}
        <label>
          Order:&nbsp;
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} disabled={sortBy === 'none'}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
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
            {filteredData.map((item, index) => (
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ItemReport;
