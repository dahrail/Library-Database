import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookDetails } from '../../services/bookService';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const data = await getBookDetails(id);
                setBook(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>{book.title}</h1>
            <p><strong>Author:</strong> {book.authorCreator}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Publication Year:</strong> {book.publicationYear}</p>
            <p><strong>Publisher:</strong> {book.publisher}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Condition:</strong> {book.conditionStatus}</p>
            <p><strong>Available Copies:</strong> {book.availableCopies}</p>
        </div>
    );
};

export default BookDetail;