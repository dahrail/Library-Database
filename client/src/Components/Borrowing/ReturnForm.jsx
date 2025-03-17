import React, { useState } from 'react';
import axios from 'axios';

function ReturnForm() {
    const [itemId, setItemId] = useState('');
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');

    const handleReturn = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/borrowings/return', { itemId, userId });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error returning item. Please try again.');
        }
    };

    return (
        <div className="return-form">
            <h2>Return Item</h2>
            <form onSubmit={handleReturn}>
                <div className="form-group">
                    <label htmlFor="itemId">Item ID:</label>
                    <input
                        type="text"
                        id="itemId"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Return Item</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default ReturnForm;