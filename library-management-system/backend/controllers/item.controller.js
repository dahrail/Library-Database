const Item = require('../models/item.model');
const Borrowing = require('../models/borrowing.model');

// Create a new item
exports.createItem = async (req, res) => {
    try {
        const item = new Item(req.body);
        await item.save();
        res.status(201).send(item);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all items
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).send(items);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update an item
exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).send();
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Borrow an item
exports.borrowItem = async (req, res) => {
    try {
        const borrowing = new Borrowing({
            userId: req.body.userId,
            itemId: req.body.itemId,
            borrowDate: new Date(),
            returnDate: null,
        });
        await borrowing.save();
        res.status(201).send(borrowing);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Return an item
exports.returnItem = async (req, res) => {
    try {
        const borrowing = await Borrowing.findById(req.params.id);
        if (!borrowing) {
            return res.status(404).send();
        }
        borrowing.returnDate = new Date();
        await borrowing.save();
        res.status(200).send(borrowing);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Place a hold on an item
exports.placeHold = async (req, res) => {
    // Implementation for placing a hold on an item
    res.status(501).send({ message: "Not implemented yet" });
};