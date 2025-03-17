const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Route to get all books
router.get('/', bookController.getAllBooks);

// Route to get a specific book by ID
router.get('/:id', bookController.getBookById);

// Route to add a new book
router.post('/', bookController.addBook);

// Route to update an existing book
router.put('/:id', bookController.updateBook);

// Route to delete a book
router.delete('/:id', bookController.deleteBook);

// Route to request a book
router.post('/:id/request', bookController.requestBook);

module.exports = router;