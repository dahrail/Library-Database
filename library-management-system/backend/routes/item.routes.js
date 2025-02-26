const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

// Route to get all items
router.get('/', itemController.getAllItems);

// Route to get a specific item by ID
router.get('/:id', itemController.getItemById);

// Route to create a new item
router.post('/', itemController.createItem);

// Route to update an existing item
router.put('/:id', itemController.updateItem);

// Route to delete an item
router.delete('/:id', itemController.deleteItem);

// Route to borrow an item
router.post('/:id/borrow', itemController.borrowItem);

// Route to return an item
router.post('/:id/return', itemController.returnItem);

// Route to place a hold on an item
router.post('/:id/hold', itemController.holdItem);

module.exports = router;