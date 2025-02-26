const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Media = require('../models/Media');
const Electronics = require('../models/Electronics');
const { Op } = require('sequelize');

// Create a new loan
exports.createLoan = async (req, res) => {
    const { userId, itemId, loanType } = req.body;

    try {
        let item;
        let dueDays;

        // Determine the item type and fetch the item
        if (loanType === 'book') {
            item = await Book.findByPk(itemId);
            dueDays = 14; // Example: 14 days for books
        } else if (loanType === 'media') {
            item = await Media.findByPk(itemId);
            dueDays = 7; // Example: 7 days for media
        } else if (loanType === 'electronic') {
            item = await Electronics.findByPk(itemId);
            dueDays = 30; // Example: 30 days for electronics
        }

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Create the loan record
        const loan = await Loan.create({
            UserID: userId,
            ItemID: itemId,
            LoanType: loanType,
            BorrowedAt: new Date(),
            DueAt: new Date(Date.now() + dueDays * 24 * 60 * 60 * 1000),
            Status: 'Active'
        });

        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: 'Error creating loan', error });
    }
};

// Get loan history for a user
exports.getLoanHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const loans = await Loan.findAll({
            where: { UserID: userId },
            include: [
                { model: Book, as: 'book', required: false },
                { model: Media, as: 'media', required: false },
                { model: Electronics, as: 'electronics', required: false }
            ]
        });

        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loan history', error });
    }
};

// Renew a loan
exports.renewLoan = async (req, res) => {
    const { loanId } = req.params;

    try {
        const loan = await Loan.findByPk(loanId);
        if (!loan || loan.Status !== 'Active') {
            return res.status(404).json({ message: 'Loan not found or not active' });
        }

        // Extend the due date
        loan.DueAt = new Date(loan.DueAt.getTime() + 7 * 24 * 60 * 60 * 1000); // Example: extend by 7 days
        loan.RenewalCount += 1;

        await loan.save();
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ message: 'Error renewing loan', error });
    }
};

// Return a loan
exports.returnLoan = async (req, res) => {
    const { loanId } = req.params;

    try {
        const loan = await Loan.findByPk(loanId);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        loan.ReturnedAt = new Date();
        loan.Status = 'Returned';

        await loan.save();
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ message: 'Error returning loan', error });
    }
};

// Get overdue loans
exports.getOverdueLoans = async (req, res) => {
    const { userId } = req.params;

    try {
        const overdueLoans = await Loan.findAll({
            where: {
                UserID: userId,
                DueAt: {
                    [Op.lt]: new Date(),
                },
                Status: 'Active'
            }
        });

        res.status(200).json(overdueLoans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching overdue loans', error });
    }
};