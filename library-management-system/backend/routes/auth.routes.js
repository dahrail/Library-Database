const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Register route
router.post('/register', userController.register);

// Login route
router.post('/login', userController.login);

// Export the router
module.exports = router;