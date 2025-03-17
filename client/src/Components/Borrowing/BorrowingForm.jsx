import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BorrowingForm() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [userId, setUserId] = useState('');
    const [borrowDate, setBorrowDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch available items for borrowing
        axios.get('/api/items')
            .then(response => {
                setItems(response.data);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to fetch items');
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const borrowingData = {
            userId,
            itemId: selectedItem,
            borrowDate,
            returnDate
        };

        axios.post('/api/borrow', borrowingData)
            .then(response => {
                alert('Item borrowed successfully!');
                navigate('/dashboard'); // Redirect to dashboard or appropriate page
            })
            .catch(err => {
                console.error(err);
                setError('Failed to borrow item');
            });
    };

    return (
        <div className="borrowing-form">
            <h2>Borrow Item</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="item">Select Item:</label>
                    <select
                        id="item"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        required
                    >
                        <option value="">Select an item</option>
                        {items.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.title} (ID: {item.id})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="borrowDate">Borrow Date:</label>
                    <input
                        type="date"
                        id="borrowDate"
                        value={borrowDate}
                        onChange={(e) => setBorrowDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="returnDate">Return Date:</label>
                    <input
                        type="date"
                        id="returnDate"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Borrow</button>
            </form>
        </div>
    );
}

export default BorrowingForm;