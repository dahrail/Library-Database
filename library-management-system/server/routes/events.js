const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorize } = require('../middleware/auth');

// Create a new event
router.post('/', authenticate, authorize('Admin'), eventController.createEvent);

// Get all events
router.get('/', authenticate, eventController.getAllEvents);

// Get a specific event by ID
router.get('/:id', authenticate, eventController.getEventById);

// Update an event by ID
router.put('/:id', authenticate, authorize('Admin'), eventController.updateEvent);

// Delete an event by ID
router.delete('/:id', authenticate, authorize('Admin'), eventController.deleteEvent);

// Get events by user ID
router.get('/user/:userId', authenticate, eventController.getEventsByUserId);

module.exports = router;