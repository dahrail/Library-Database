const Notification = require('../models/Notification');

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const notifications = await Notification.findAll({ where: { UserID: userId } });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notifications', error });
    }
};

// Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const { UserID, MessageType, MessageContent } = req.body;
        const newNotification = await Notification.create({
            UserID,
            MessageType,
            MessageContent,
            SentDateTime: new Date(),
            Acknowledged: false,
        });
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notification', error });
    }
};

// Acknowledge a notification
exports.acknowledgeNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.Acknowledged = true;
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error acknowledging notification', error });
    }
};