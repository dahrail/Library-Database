const Fine = require('../models/Fine');
const Loan = require('../models/Loan');

// Get all fines for a user
exports.getFinesByUser = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const fines = await Fine.findAll({ where: { UserID: userId } });
        res.status(200).json(fines);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving fines', error });
    }
};

// Create a new fine
exports.createFine = async (req, res) => {
    try {
        const { LoanID, UserID, Amount } = req.body;
        const fine = await Fine.create({ LoanID, UserID, Amount, IssuedDate: new Date() });
        res.status(201).json(fine);
    } catch (error) {
        res.status(500).json({ message: 'Error creating fine', error });
    }
};

// Mark a fine as paid
exports.payFine = async (req, res) => {
    try {
        const { fineId } = req.params;
        const fine = await Fine.findByPk(fineId);
        if (!fine) {
            return res.status(404).json({ message: 'Fine not found' });
        }
        fine.PaidDate = new Date();
        fine.Status = 'Paid';
        await fine.save();
        res.status(200).json(fine);
    } catch (error) {
        res.status(500).json({ message: 'Error updating fine', error });
    }
};

// Get overdue fines
exports.getOverdueFines = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const loans = await Loan.findAll({ where: { UserID: userId, Status: 'Overdue' } });
        const overdueFines = await Fine.findAll({ where: { LoanID: loans.map(loan => loan.LoanID) } });
        res.status(200).json(overdueFines);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving overdue fines', error });
    }
};