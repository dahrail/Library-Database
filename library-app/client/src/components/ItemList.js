import React, { useEffect, useState } from 'react';

const ItemList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('/api/items');
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="item-list">
            <h2>Available Items</h2>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <h3>{item.title}</h3>
                        <p>Author: {item.author}</p>
                        <p>Available Copies: {item.availableCopies}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;