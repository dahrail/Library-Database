const Borrowing = require('../models/borrowing.model');
const Item = require('../models/item.model');
const User = require('../models/user.model');

exports.borrowItem = async (req, res) => {
    const { userId, itemId, borrowDays } = req.body;

    try {
        const user = await User.findById(userId);
        const item = await Item.findById(itemId);

        if (!user || !item) {
            return res.status(404).send({ message: 'User or Item not found' });
        }

        const borrowingLimit = user.role === 'faculty' ? 10 : 5; // Faculty can borrow 10, students 5
        const borrowDuration = user.role === 'faculty' ? 30 : 14; // Faculty 30 days, students 14 days

        const currentBorrowings = await Borrowing.countDocuments({ userId: userId, returned: false });

        if (currentBorrowings >= borrowingLimit) {
            return res.status(400).send({ message: 'Borrowing limit reached' });
        }

        if (borrowDays > borrowDuration) {
            return res.status(400).send({ message: `Cannot borrow for more than ${borrowDuration} days` });
        }

        const newBorrowing = new Borrowing({
            userId,
            itemId,
            borrowDays,
            dueDate: new Date(Date.now() + borrowDays * 24 * 60 * 60 * 1000),
            returned: false
        });

        await newBorrowing.save();
        res.status(201).send(newBorrowing);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.returnItem = async (req, res) => {
    const { borrowingId } = req.params;

    try {
        const borrowing = await Borrowing.findById(borrowingId);

        if (!borrowing || borrowing.returned) {
            return res.status(404).send({ message: 'Borrowing record not found or already returned' });
        }

        borrowing.returned = true;
        await borrowing.save();

        const today = new Date();
        if (today > borrowing.dueDate) {
            const daysLate = Math.ceil((today - borrowing.dueDate) / (1000 * 60 * 60 * 24));
            // Assume fine is $1 per day late
            const fineAmount = daysLate;
            // Logic to handle fines can be added here
        }

        res.status(200).send(borrowing);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.holdItem = async (req, res) => {
    const { userId, itemId } = req.body;

    try {
        const user = await User.findById(userId);
        const item = await Item.findById(itemId);

        if (!user || !item) {
            return res.status(404).send({ message: 'User or Item not found' });
        }

        // Logic to place a hold on the item can be added here

        res.status(200).send({ message: 'Item hold placed successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};