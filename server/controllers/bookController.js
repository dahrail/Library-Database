const Book = require('../models/book');
const Copy = require('../models/copy');

// Add a new book
exports.addBook = async (req, res) => {
    try {
        const { title, author, genre, publicationYear, copies } = req.body;
        const newBook = await Book.create({ title, author, genre, publicationYear });

        // Add copies for the new book
        for (let i = 0; i < copies; i++) {
            await Copy.create({ bookId: newBook.id });
        }

        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book', error });
    }
};

// Edit an existing book
exports.editBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, genre, publicationYear } = req.body;

        const updatedBook = await Book.update({ title, author, genre, publicationYear }, { where: { id } });

        if (updatedBook[0] === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error });
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBook = await Book.destroy({ where: { id } });

        if (deletedBook === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
};

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

// Get book details by ID
exports.getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details', error });
    }
};