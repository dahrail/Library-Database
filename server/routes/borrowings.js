const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

// Route to borrow an item
router.post('/borrow', authenticateUser, borrowingController.borrowItem);

// Route to return an item
router.post('/return', authenticateUser, borrowingController.returnItem);

// Route to get all borrowings for a user
router.get('/user/:userId', authenticateUser, borrowingController.getUserBorrowings);

// Route to get all borrowings
router.get('/', authorizeRoles('admin'), borrowingController.getAllBorrowings);

// Route to request a hold on an item
router.post('/hold', authenticateUser, borrowingController.holdItem);

module.exports = router;