import React, { useEffect, useState } from 'react';
import { getBorrowedItems, getFines } from '../../services/bookService';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [fines, setFines] = useState(0);

    useEffect(() => {
        fetchBorrowedItems();
        fetchFines();
    }, []);

    const fetchBorrowedItems = async () => {
        const items = await getBorrowedItems('faculty'); // Assuming 'faculty' is the role
        setBorrowedItems(items);
    };

    const fetchFines = async () => {
        const totalFines = await getFines('faculty'); // Assuming 'faculty' is the role
        setFines(totalFines);
    };

    return (
        <div className="faculty-dashboard">
            <h1>Faculty Dashboard</h1>
            <h2>Borrowed Items</h2>
            <ul>
                {borrowedItems.map(item => (
                    <li key={item.id}>
                        {item.title} - Due Date: {item.dueDate}
                    </li>
                ))}
            </ul>
            <h2>Total Fines: ${fines}</h2>
        </div>
    );
};

export default FacultyDashboard;