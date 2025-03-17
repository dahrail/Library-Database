import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RequestBook() {
    const [bookId, setBookId] = useState('');
    const [userId, setUserId] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const requestData = {
            bookId,
            userId,
            requestDate,
        };

        axios.post('/api/request_book', requestData)
            .then((response) => {
                setMessage('Book request submitted successfully!');
                setTimeout(() => {
                    navigate('/'); // Redirect to home or another page after submission
                }, 2000);
            })
            .catch((error) => {
                setMessage('Error submitting request. Please try again.');
                console.error(error);
            });
    };

    return (
        <div className="container">
            <h2>Request a Book</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="bookId">Book ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="bookId"
                        value={bookId}
                        onChange={(e) => setBookId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="requestDate">Request Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="requestDate"
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit Request</button>
            </form>
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
}

export default RequestBook;