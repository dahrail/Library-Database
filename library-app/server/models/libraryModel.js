const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    type: { type: String, enum: ['book', 'media', 'device'], required: true },
    copies: { type: Number, required: true, min: 1 },
    availableCopies: { type: Number, required: true, min: 0 },
    borrowLimit: { type: Number, required: true },
    borrowDuration: { type: Number, required: true }, // in days
    finesPerDay: { type: Number, required: true }
});

const patronSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'faculty'], required: true },
    borrowedItems: [{ 
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        borrowDate: { type: Date, default: Date.now },
        dueDate: { type: Date },
        returned: { type: Boolean, default: false }
    }]
});

const Item = mongoose.model('Item', itemSchema);
const Patron = mongoose.model('Patron', patronSchema);

module.exports = { Item, Patron };