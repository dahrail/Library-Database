import React, { useEffect, useState } from 'react';
import { getBorrowedItems } from '../../services/bookService';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBorrowedItems = async () => {
            try {
                const response = await getBorrowedItems();
                setBorrowedItems(response.data);
            } catch (error) {
                console.error("Error fetching borrowed items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowedItems();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Student Dashboard</h1>
            <h2>Your Borrowed Items</h2>
            {borrowedItems.length === 0 ? (
                <p>You have not borrowed any items.</p>
            ) : (
                <ul>
                    {borrowedItems.map(item => (
                        <li key={item.id}>
                            <Link to={`/books/${item.id}`}>{item.title}</Link> - Due Date: {item.dueDate}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentDashboard;