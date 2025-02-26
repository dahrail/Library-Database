const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Register a new user
exports.register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: hashedPassword,
            Role: role,
            RegistrationDate: new Date(),
            AccountStatus: 'Active',
            BorrowLimit: role === 'Faculty' ? 10 : 5 // Example limits
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ Email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.UserID, role: user.Role }, config.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { userId: user.UserID, role: user.Role } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Middleware to authenticate user
exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    });
};