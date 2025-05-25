const { body } = require('express-validator');

const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),

    body('email').isEmail().withMessage('Invalid email format'),

    body('email').notEmpty().withMessage('Email is required'),

    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    body('password').notEmpty().withMessage('Password is required'),

    body('preferences').isArray({ min: 1 }).withMessage('Select at least one news preference'),

    body('preferences.*').isString().withMessage('News preference must be a string')
];

module.exports = { registerValidation };