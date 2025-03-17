const mongoose = require('mongoose');

const copySchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    copyNumber: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'borrowed', 'reserved'],
        default: 'available'
    },
    dueDate: {
        type: Date,
        default: null
    },
    fineAmount: {
        type: Number,
        default: 0
    }
});

// Trigger to update fine amount when due date is exceeded
copySchema.pre('save', function(next) {
    if (this.dueDate && this.dueDate < new Date() && this.status === 'borrowed') {
        this.fineAmount = Math.max(0, this.fineAmount + 5); // Example fine increment
    }
    next();
});

// Trigger to reset fine amount when item is returned
copySchema.post('save', function(doc) {
    if (this.status === 'available') {
        this.fineAmount = 0; // Reset fine when item is available
    }
});

const Copy = mongoose.model('Copy', copySchema);

module.exports = Copy;