const Fine = require('../models/fine.model');

// Create a new fine
exports.createFine = (req, res) => {
    const fine = new Fine({
        userId: req.body.userId,
        itemId: req.body.itemId,
        amount: req.body.amount,
        dueDate: req.body.dueDate,
        paid: req.body.paid || false
    });

    fine.save()
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the fine."
            });
        });
};

// Get all fines for a user
exports.getFinesByUserId = (req, res) => {
    Fine.find({ userId: req.params.userId })
        .then(fines => {
            res.status(200).send(fines);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving fines."
            });
        });
};

// Update a fine status (paid/unpaid)
exports.updateFineStatus = (req, res) => {
    Fine.findByIdAndUpdate(req.params.id, { paid: req.body.paid }, { new: true })
        .then(fine => {
            if (!fine) {
                return res.status(404).send({
                    message: "Fine not found with id " + req.params.id
                });
            }
            res.send(fine);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error updating fine with id " + req.params.id
            });
        });
};