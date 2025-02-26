const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticate } = require('../middleware/auth');

// Route to create a new loan
router.post('/', authenticate, loanController.createLoan);

// Route to get loan history for a user
router.get('/history', authenticate, loanController.getLoanHistory);

// Route to renew a loan
router.put('/renew/:loanId', authenticate, loanController.renewLoan);

// Route to return a loan
router.put('/return/:loanId', authenticate, loanController.returnLoan);

// Route to get all loans (Admin only)
router.get('/', authenticate, loanController.getAllLoans);

module.exports = router;