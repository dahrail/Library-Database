const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    publicationYear: {
        type: Number,
        required: true
    },
    copies: {
        type: Number,
        required: true,
        default: 1
    },
    availableCopies: {
        type: Number,
        required: true,
        default: 1
    },
    finePerDay: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;