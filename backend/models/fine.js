const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paid: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Trigger to automatically set fine amount based on overdue days
fineSchema.pre('save', function(next) {
    const currentDate = new Date();
    if (this.dueDate < currentDate && !this.paid) {
        const daysOverdue = Math.ceil((currentDate - this.dueDate) / (1000 * 60 * 60 * 24));
        this.amount = daysOverdue * 5; // Example: $5 fine per day
    }
    next();
});

const Fine = mongoose.model('Fine', fineSchema);

module.exports = Fine;