import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddBook() {
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        isbn: '',
        copies: '',
        category: '',
        description: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/books', bookData);
            navigate('/books'); // Redirect to the book list after adding
        } catch (error) {
            console.error("There was an error adding the book!", error);
        }
    };

    return (
        <div className="container">
            <h2>Add New Book</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={bookData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input type="text" className="form-control" id="author" name="author" value={bookData.author} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="isbn">ISBN</label>
                    <input type="text" className="form-control" id="isbn" name="isbn" value={bookData.isbn} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="copies">Number of Copies</label>
                    <input type="number" className="form-control" id="copies" name="copies" value={bookData.copies} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" className="form-control" id="category" name="category" value={bookData.category} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" id="description" name="description" value={bookData.description} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Add Book</button>
            </form>
        </div>
    );
}

export default AddBook;