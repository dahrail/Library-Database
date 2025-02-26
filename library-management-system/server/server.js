const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const mediaRoutes = require('./routes/media');
const electronicsRoutes = require('./routes/electronics');
const loanRoutes = require('./routes/loans');
const holdRoutes = require('./routes/holds');
const roomRoutes = require('./routes/rooms');
const fineRoutes = require('./routes/fines');
const notificationRoutes = require('./routes/notifications');
const eventRoutes = require('./routes/events');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/electronics', electronicsRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/holds', holdRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});