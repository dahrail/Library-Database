const express = require('express');
const router = express.Router();
const holdController = require('../controllers/holdController');
const { authenticate } = require('../middleware/auth');

// Route to create a new hold
router.post('/', authenticate, holdController.createHold);

// Route to get all holds for a user
router.get('/', authenticate, holdController.getUserHolds);

// Route to update a hold status
router.put('/:id', authenticate, holdController.updateHoldStatus);

// Route to cancel a hold
router.delete('/:id', authenticate, holdController.cancelHold);

module.exports = router;