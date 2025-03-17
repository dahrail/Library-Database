const express = require('express');
const Borrowing = require('../models/borrowing');
const Book = require('../models/book');
const User = require('../models/user');

const router = express.Router();

// Borrow an item
router.post('/borrow', async (req, res) => {
    const { userId, bookId } = req.body;

    try {
        const user = await User.findById(userId);
        const book = await Book.findById(bookId);

        if (!user || !book) {
            return res.status(404).json({ message: 'User or Book not found' });
        }

        // Check borrowing limits and conditions
        const currentBorrowings = await Borrowing.countDocuments({ userId });
        if (user.role === 'student' && currentBorrowings >= 2) {
            return res.status(400).json({ message: 'Students can borrow a maximum of 2 items' });
        } else if (user.role === 'faculty' && currentBorrowings >= 5) {
            return res.status(400).json({ message: 'Faculty can borrow a maximum of 5 items' });
        }

        const newBorrowing = new Borrowing({
            userId,
            bookId,
            borrowedAt: new Date(),
            dueDate: user.role === 'student' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        });

        await newBorrowing.save();
        res.status(201).json({ message: 'Item borrowed successfully', borrowing: newBorrowing });
    } catch (error) {
        res.status(500).json({ message: 'Error borrowing item', error });
    }
});

// Return an item
router.post('/return', async (req, res) => {
    const { borrowingId } = req.body;

    try {
        const borrowing = await Borrowing.findById(borrowingId);
        if (!borrowing) {
            return res.status(404).json({ message: 'Borrowing record not found' });
        }

        const fine = calculateFine(borrowing.dueDate);
        if (fine > 0) {
            // Logic to add fine to user's account can be implemented here
        }

        await Borrowing.findByIdAndDelete(borrowingId);
        res.status(200).json({ message: 'Item returned successfully', fine });
    } catch (error) {
        res.status(500).json({ message: 'Error returning item', error });
    }
});

// Calculate fine based on due date
const calculateFine = (dueDate) => {
    const now = new Date();
    if (now > dueDate) {
        const daysLate = Math.ceil((now - dueDate) / (1000 * 60 * 60 * 24));
        return daysLate * 1; // Assuming fine is $1 per day
    }
    return 0;
};

// Get user's borrowings
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const borrowings = await Borrowing.find({ userId }).populate('bookId');
        res.status(200).json(borrowings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching borrowings', error });
    }
});

module.exports = router;