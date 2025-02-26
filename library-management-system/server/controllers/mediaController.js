const Media = require('../models/Media');
const MediaInventory = require('../models/MediaInventory');

// Get all media items
exports.getAllMedia = async (req, res) => {
    try {
        const mediaItems = await Media.findAll();
        res.status(200).json(mediaItems);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving media items', error });
    }
};

// Get media item by ID
exports.getMediaById = async (req, res) => {
    const { id } = req.params;
    try {
        const mediaItem = await Media.findByPk(id);
        if (!mediaItem) {
            return res.status(404).json({ message: 'Media item not found' });
        }
        res.status(200).json(mediaItem);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving media item', error });
    }
};

// Create a new media item
exports.createMedia = async (req, res) => {
    const newMedia = req.body;
    try {
        const mediaItem = await Media.create(newMedia);
        res.status(201).json(mediaItem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating media item', error });
    }
};

// Update a media item
exports.updateMedia = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const mediaItem = await Media.findByPk(id);
        if (!mediaItem) {
            return res.status(404).json({ message: 'Media item not found' });
        }
        await mediaItem.update(updatedData);
        res.status(200).json(mediaItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating media item', error });
    }
};

// Delete a media item
exports.deleteMedia = async (req, res) => {
    const { id } = req.params;
    try {
        const mediaItem = await Media.findByPk(id);
        if (!mediaItem) {
            return res.status(404).json({ message: 'Media item not found' });
        }
        await mediaItem.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting media item', error });
    }
};