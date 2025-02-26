const db = require('../config/db');
const Book = require('../models/Book');
const BookInventory = require('../models/BookInventory');

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving books', error });
    }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findByPk(id);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving book', error });
    }
};

// Create a new book
exports.createBook = async (req, res) => {
    const newBook = req.body;
    try {
        const book = await Book.create(newBook);
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error creating book', error });
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const [updated] = await Book.update(updatedData, {
            where: { BookID: id }
        });
        if (updated) {
            const updatedBook = await Book.findByPk(id);
            res.status(200).json(updatedBook);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Book.destroy({
            where: { BookID: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
};