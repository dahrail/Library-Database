import React from 'react';

const BookCard = ({ book }) => {
    return (
        <div className="book-card">
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Copies Available: {book.copiesAvailable}</p>
            <p>Borrowing Limit: {book.borrowingLimit} days</p>
            <p>Fine per day: ${book.finePerDay}</p>
            <button>Request/Hold</button>
        </div>
    );
};

export default BookCard;