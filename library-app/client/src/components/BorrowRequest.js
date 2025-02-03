import React, { useState, useEffect } from 'react';

const BorrowRequest = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [patronType, setPatronType] = useState('student'); // or 'faculty'
    const [requestStatus, setRequestStatus] = useState('');

    useEffect(() => {
        // Fetch available items from the server
        const fetchItems = async () => {
            const response = await fetch('/api/items');
            const data = await response.json();
            setItems(data);
        };
        fetchItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId: selectedItem, patronType }),
        });

        if (response.ok) {
            setRequestStatus('Request submitted successfully!');
        } else {
            setRequestStatus('Failed to submit request.');
        }
    };

    return (
        <div className="borrow-request">
            <h2>Borrow Request</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Select Item:
                    <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                        <option value="">--Select an item--</option>
                        {items.map(item => (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Patron Type:
                    <select value={patronType} onChange={(e) => setPatronType(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                    </select>
                </label>
                <button type="submit">Submit Request</button>
            </form>
            {requestStatus && <p>{requestStatus}</p>}
        </div>
    );
};

export default BorrowRequest;