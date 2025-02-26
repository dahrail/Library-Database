import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createHold } from '../../services/holdService';
import { getAvailableItems } from '../../services/bookService'; // Assuming you have a service to fetch available items

const CreateHold = () => {
  const [itemId, setItemId] = useState('');
  const [itemType, setItemType] = useState('Book'); // Default to Book
  const [availableItems, setAvailableItems] = useState([]);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchAvailableItems = async () => {
      try {
        const items = await getAvailableItems(); // Fetch available items from the API
        setAvailableItems(items);
      } catch (err) {
        setError('Failed to fetch available items');
      }
    };

    fetchAvailableItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHold({ itemId, itemType });
      history.push('/holds'); // Redirect to holds list after successful creation
    } catch (err) {
      setError('Failed to create hold');
    }
  };

  return (
    <div>
      <h2>Create Hold</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="itemId">Select Item:</label>
          <select
            id="itemId"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            required
          >
            <option value="">Select an item</option>
            {availableItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.type})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="itemType">Item Type:</label>
          <select
            id="itemType"
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
          >
            <option value="Book">Book</option>
            <option value="Media">Media</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>
        <button type="submit">Create Hold</button>
      </form>
    </div>
  );
};

export default CreateHold;