import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import loanService from '../../services/loanService';
import bookService from '../../services/bookService';
import mediaService from '../../services/mediaService';
import electronicsService from '../../services/electronicsService';

const NewLoan = () => {
    const [itemType, setItemType] = useState('book');
    const [itemId, setItemId] = useState('');
    const [items, setItems] = useState([]);
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchItems = async () => {
            let fetchedItems = [];
            if (itemType === 'book') {
                fetchedItems = await bookService.getAvailableBooks();
            } else if (itemType === 'media') {
                fetchedItems = await mediaService.getAvailableMedia();
            } else if (itemType === 'electronic') {
                fetchedItems = await electronicsService.getAvailableElectronics();
            }
            setItems(fetchedItems);
        };
        fetchItems();
    }, [itemType]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loanService.createLoan({ itemId, itemType, dueDate });
            history.push('/loans/history');
        } catch (err) {
            setError('Failed to create loan. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create New Loan</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Item Type:</label>
                    <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
                        <option value="book">Book</option>
                        <option value="media">Media</option>
                        <option value="electronic">Electronic</option>
                    </select>
                </div>
                <div>
                    <label>Item ID:</label>
                    <input
                        type="text"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Loan</button>
            </form>
            <h3>Available Items</h3>
            <ul>
                {items.map(item => (
                    <li key={item.id}>{item.title || item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default NewLoan;