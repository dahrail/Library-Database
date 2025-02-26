const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');

// Route to get all media items
router.get('/', mediaController.getAllMedia);

// Route to get a specific media item by ID
router.get('/:id', mediaController.getMediaById);

// Route to create a new media item
router.post('/', mediaController.createMedia);

// Route to update an existing media item
router.put('/:id', mediaController.updateMedia);

// Route to delete a media item
router.delete('/:id', mediaController.deleteMedia);

// Route to get media inventory
router.get('/inventory', mediaController.getMediaInventory);

// Route to update media inventory
router.put('/inventory/:id', mediaController.updateMediaInventory);

module.exports = router;