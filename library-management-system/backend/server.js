const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const itemRoutes = require('./routes/item.routes');
const borrowingRoutes = require('./routes/borrowing.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync().then(() => {
    console.log('Database synced');
}).catch(err => {
    console.error('Failed to sync database:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/borrowings', borrowingRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});