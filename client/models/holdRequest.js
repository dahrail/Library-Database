const mongoose = require('mongoose');

const holdRequestSchema = new mongoose.Schema({
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
    requestDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    expirationDate: {
        type: Date,
        required: true
    }
});

holdRequestSchema.index({ userId: 1, itemId: 1 }, { unique: true });

const HoldRequest = mongoose.model('HoldRequest', holdRequestSchema);

module.exports = HoldRequest;