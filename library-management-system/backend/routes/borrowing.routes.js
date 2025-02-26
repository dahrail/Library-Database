const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowing.controller');

// Route to borrow an item
router.post('/borrow', borrowingController.borrowItem);

// Route to return an item
router.post('/return', borrowingController.returnItem);

// Route to get borrowing history for a user
router.get('/history/:userId', borrowingController.getBorrowingHistory);

// Route to place a hold on an item
router.post('/hold', borrowingController.placeHold);

// Route to get fines for a user
router.get('/fines/:userId', borrowingController.getFines);

module.exports = router;