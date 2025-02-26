const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fineController');

// Get all fines for a user
router.get('/:userId', fineController.getFinesByUserId);

// Create a new fine
router.post('/', fineController.createFine);

// Update a fine status (e.g., mark as paid)
router.put('/:fineId', fineController.updateFineStatus);

// Delete a fine
router.delete('/:fineId', fineController.deleteFine);

module.exports = router;