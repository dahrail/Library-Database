const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Route to get fine report
router.get('/fines', reportController.getFineReport);

// Route to get inventory report
router.get('/inventory', reportController.getInventoryReport);

// Route to get borrowing report
router.get('/borrowing', reportController.getBorrowingReport);

module.exports = router;