const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications for a user
router.get('/:userId', notificationController.getNotifications);

// Create a new notification
router.post('/', notificationController.createNotification);

// Acknowledge a notification
router.put('/:notificationId/acknowledge', notificationController.acknowledgeNotification);

// Delete a notification
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;