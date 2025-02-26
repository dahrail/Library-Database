const express = require('express');
const router = express.Router();
const electronicsController = require('../controllers/electronicsController');

// Route to get all electronics
router.get('/', electronicsController.getAllElectronics);

// Route to get a specific electronic item by ID
router.get('/:id', electronicsController.getElectronicsById);

// Route to create a new electronic item
router.post('/', electronicsController.createElectronics);

// Route to update an existing electronic item
router.put('/:id', electronicsController.updateElectronics);

// Route to delete an electronic item
router.delete('/:id', electronicsController.deleteElectronics);

module.exports = router;