import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

const PatronDashboard = () => {
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [fines, setFines] = useState(0);

    useEffect(() => {
        const fetchBorrowedItems = async () => {
            try {
                const response = await axios.get('/api/library/borrowed-items');
                setBorrowedItems(response.data);
            } catch (error) {
                console.error('Error fetching borrowed items:', error);
            }
        };

        const fetchFines = async () => {
            try {
                const response = await axios.get('/api/library/fines');
                setFines(response.data.totalFines);
            } catch (error) {
                console.error('Error fetching fines:', error);
            }
        };

        fetchBorrowedItems();
        fetchFines();
    }, []);

    return (
        <div className="patron-dashboard">
            <h2>Patron Dashboard</h2>
            <h3>Borrowed Items</h3>
            <ul>
                {borrowedItems.map(item => (
                    <li key={item.id}>
                        {item.title} - Due Date: {item.dueDate}
                    </li>
                ))}
            </ul>
            <h3>Total Fines: ${fines.toFixed(2)}</h3>
        </div>
    );
};

export default PatronDashboard;