const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    borrowDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['borrowed', 'returned', 'overdue'],
        default: 'borrowed'
    },
    fine: {
        type: Number,
        default: 0
    }
});

// Trigger to calculate fine when an item is overdue
borrowingSchema.pre('save', function(next) {
    const today = new Date();
    if (this.returnDate < today && this.status === 'borrowed') {
        const daysOverdue = Math.ceil((today - this.returnDate) / (1000 * 60 * 60 * 24));
        this.fine = daysOverdue * 5; // Assuming a fine of $5 per day
    }
    next();
});

// Trigger to update status to 'overdue' if return date has passed
borrowingSchema.pre('save', function(next) {
    const today = new Date();
    if (this.returnDate < today) {
        this.status = 'overdue';
    }
    next();
});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);

module.exports = Borrowing;