import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);

  useEffect(() => {
    fetchBorrowedItems();
    fetchAvailableBooks();
  }, []);

  const fetchBorrowedItems = async () => {
    try {
      const response = await axios.get('/api/borrowings/my-borrowings');
      setBorrowedItems(response.data);
    } catch (error) {
      console.error('Error fetching borrowed items:', error);
    }
  };

  const fetchAvailableBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setAvailableBooks(response.data);
    } catch (error) {
      console.error('Error fetching available books:', error);
    }
  };

  return (
    <div className="student-dashboard">
      <h2>Welcome to the Student Dashboard</h2>
      <h3>Your Borrowed Items</h3>
      <ul>
        {borrowedItems.map(item => (
          <li key={item.id}>
            {item.title} - Due Date: {item.dueDate}
          </li>
        ))}
      </ul>
      <h3>Available Books</h3>
      <ul>
        {availableBooks.map(book => (
          <li key={book.id}>
            {book.title} - Author: {book.author}
            <button onClick={() => requestBook(book.id)}>Request</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const requestBook = async (bookId) => {
  try {
    await axios.post('/api/borrowings/request', { bookId });
    alert('Book requested successfully!');
  } catch (error) {
    console.error('Error requesting book:', error);
    alert('Failed to request book.');
  }
};

export default StudentDashboard;