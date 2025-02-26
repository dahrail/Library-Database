const Hold = require('../models/Hold');
const User = require('../models/User');
const Book = require('../models/Book');
const Media = require('../models/Media');
const Electronics = require('../models/Electronics');

// Create a new hold
exports.createHold = async (req, res) => {
    try {
        const { userId, itemId, itemType } = req.body;

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if item exists based on itemType
        let item;
        if (itemType === 'Book') {
            item = await Book.findByPk(itemId);
        } else if (itemType === 'Media') {
            item = await Media.findByPk(itemId);
        } else if (itemType === 'Electronics') {
            item = await Electronics.findByPk(itemId);
        }

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Create hold
        const hold = await Hold.create({
            UserID: userId,
            ItemID: itemId,
            ItemType: itemType,
            RequestedAt: new Date(),
            HoldStatus: 'Pending'
        });

        return res.status(201).json(hold);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all holds for a user
exports.getUserHolds = async (req, res) => {
    try {
        const { userId } = req.params;

        const holds = await Hold.findAll({ where: { UserID: userId } });

        return res.status(200).json(holds);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update hold status
exports.updateHoldStatus = async (req, res) => {
    try {
        const { holdId } = req.params;
        const { holdStatus } = req.body;

        const hold = await Hold.findByPk(holdId);
        if (!hold) {
            return res.status(404).json({ message: 'Hold not found' });
        }

        hold.HoldStatus = holdStatus;
        await hold.save();

        return res.status(200).json(hold);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a hold
exports.deleteHold = async (req, res) => {
    try {
        const { holdId } = req.params;

        const hold = await Hold.findByPk(holdId);
        if (!hold) {
            return res.status(404).json({ message: 'Hold not found' });
        }

        await hold.destroy();

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};