import React, { useEffect, useState } from 'react';
import { getBorrowingHistory } from '../services/bookService';
import { useAuth } from '../hooks/useAuth';

const BorrowingsPage = () => {
    const [borrowings, setBorrowings] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchBorrowings = async () => {
            try {
                const data = await getBorrowingHistory(user.id);
                setBorrowings(data);
            } catch (error) {
                console.error("Error fetching borrowing history:", error);
            }
        };

        fetchBorrowings();
    }, [user.id]);

    return (
        <div>
            <h1>Your Borrowing History</h1>
            <table>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Borrowed Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {borrowings.map(borrowing => (
                        <tr key={borrowing.id}>
                            <td>{borrowing.itemId}</td>
                            <td>{borrowing.itemName}</td>
                            <td>{new Date(borrowing.borrowedDate).toLocaleDateString()}</td>
                            <td>{new Date(borrowing.dueDate).toLocaleDateString()}</td>
                            <td>{borrowing.returned ? 'Returned' : 'Pending'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BorrowingsPage;