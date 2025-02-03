import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LibraryInterface: React.FC = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('/api/library/items');
                setItems(response.data);
            } catch (err) {
                setError('Failed to fetch items');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleBorrow = async (itemId: string) => {
        try {
            await axios.post(`/api/library/borrow/${itemId}`);
            // Optionally refresh items or update state
        } catch (err) {
            setError('Failed to borrow item');
        }
    };

    const handleReturn = async (itemId: string) => {
        try {
            await axios.post(`/api/library/return/${itemId}`);
            // Optionally refresh items or update state
        } catch (err) {
            setError('Failed to return item');
        }
    };

    const handleRequest = async (itemId: string) => {
        try {
            await axios.post(`/api/library/request/${itemId}`);
            // Optionally refresh items or update state
        } catch (err) {
            setError('Failed to request item');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Library Interface</h1>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <h2>{item.title}</h2>
                        <p>Type: {item.type}</p>
                        <p>Available Copies: {item.copiesAvailable}</p>
                        <button onClick={() => handleBorrow(item.id)}>Borrow</button>
                        <button onClick={() => handleReturn(item.id)}>Return</button>
                        <button onClick={() => handleRequest(item.id)}>Request</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LibraryInterface;