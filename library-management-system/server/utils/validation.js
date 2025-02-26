const { body, validationResult } = require('express-validator');

const validateUserRegistration = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Email is not valid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Email is not valid'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateBookCreation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('authorCreator').notEmpty().withMessage('Author/Creator is required'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('publicationYear').isNumeric().withMessage('Publication year must be a number'),
  body('isbn10').isLength({ min: 10, max: 10 }).withMessage('ISBN-10 must be 10 characters long'),
  body('isbn13').isLength({ min: 13, max: 13 }).withMessage('ISBN-13 must be 13 characters long'),
];

const validateLoanRequest = [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('loanType').isIn(['book', 'media', 'electronic']).withMessage('Loan type must be either book, media, or electronic'),
];

const validateHoldRequest = [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('itemType').isIn(['Book', 'Media', 'Electronics']).withMessage('Item type must be either Book, Media, or Electronics'),
];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateBookCreation,
  validateLoanRequest,
  validateHoldRequest,
  validateRequest,
};