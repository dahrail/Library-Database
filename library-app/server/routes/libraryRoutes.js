const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

// Route to get all available items
router.get('/items', libraryController.getAllItems);

// Route to borrow an item
router.post('/borrow', libraryController.borrowItem);

// Route to return an item
router.post('/return', libraryController.returnItem);

// Route to get borrowed items for a patron
router.get('/patron/:id/borrowed', libraryController.getBorrowedItems);

// Route to place a hold on an item
router.post('/hold', libraryController.placeHold);

// Route to get fines for a patron
router.get('/patron/:id/fines', libraryController.getFines);

module.exports = router;