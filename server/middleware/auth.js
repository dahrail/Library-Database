const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied. You do not have the required permissions.' });
        }

        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };