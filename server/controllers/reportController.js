const express = require('express');
const router = express.Router();
const db = require('../utils/database');

// Report for fines due
router.get('/fines', async (req, res) => {
    try {
        const query = `
            SELECT u.id AS userId, u.name, SUM(f.amount) AS totalFines
            FROM users u
            JOIN fines f ON u.id = f.userId
            WHERE f.paid = false
            GROUP BY u.id
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving fines report', error });
    }
});

// Report for borrowing activity
router.get('/borrowing-activity', async (req, res) => {
    try {
        const query = `
            SELECT b.id AS bookId, b.title, COUNT(br.id) AS totalBorrowed
            FROM books b
            LEFT JOIN borrowings br ON b.id = br.bookId
            GROUP BY b.id
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving borrowing activity report', error });
    }
});

// Inventory report
router.get('/inventory', async (req, res) => {
    try {
        const query = `
            SELECT b.id AS bookId, b.title, COUNT(c.id) AS totalCopies
            FROM books b
            JOIN copies c ON b.id = c.bookId
            GROUP BY b.id
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving inventory report', error });
    }
});

module.exports = router;