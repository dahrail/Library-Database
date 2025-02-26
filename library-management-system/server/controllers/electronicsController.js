const Electronics = require('../models/Electronics');

// Get all electronics
exports.getAllElectronics = async (req, res) => {
    try {
        const electronics = await Electronics.findAll();
        res.status(200).json(electronics);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving electronics', error });
    }
};

// Get electronics by ID
exports.getElectronicsById = async (req, res) => {
    const { id } = req.params;
    try {
        const electronic = await Electronics.findByPk(id);
        if (electronic) {
            res.status(200).json(electronic);
        } else {
            res.status(404).json({ message: 'Electronics not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving electronics', error });
    }
};

// Create new electronic
exports.createElectronic = async (req, res) => {
    const { brand, model, serialNumber, status, purchaseDate, notes } = req.body;
    try {
        const newElectronic = await Electronics.create({ brand, model, serialNumber, status, purchaseDate, notes });
        res.status(201).json(newElectronic);
    } catch (error) {
        res.status(500).json({ message: 'Error creating electronic', error });
    }
};

// Update electronic
exports.updateElectronic = async (req, res) => {
    const { id } = req.params;
    const { brand, model, serialNumber, status, purchaseDate, notes } = req.body;
    try {
        const [updated] = await Electronics.update({ brand, model, serialNumber, status, purchaseDate, notes }, {
            where: { DeviceID: id }
        });
        if (updated) {
            const updatedElectronic = await Electronics.findByPk(id);
            res.status(200).json(updatedElectronic);
        } else {
            res.status(404).json({ message: 'Electronics not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating electronic', error });
    }
};

// Delete electronic
exports.deleteElectronic = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Electronics.destroy({
            where: { DeviceID: id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Electronics not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting electronic', error });
    }
};