const { body, validationResult } = require('express-validator')
const signupValidationRules = () => {
    return [
        body('userName').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email address').notEmpty().withMessage('Email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').notEmpty().withMessage('Password is required')
    ];
};
const loginValidationRules = () => {
    return [
        body('email').isEmail().withMessage('Invalid email address').notEmpty().withMessage('Email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ];
};
const googleLoginValidationRules = () => {
    return [
        body('userName').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email address').notEmpty().withMessage('Email is required'),
        body('profilePicture').isURL().withMessage('Invalid URL')
    ];
}
const updateUserDataValidationRules = () => {
    return [
        body('isd_code').isString().withMessage('ISD code must be a string'),
        body('phone_number')
            .isString().withMessage('Phone number must be a string')
            .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits')
            .matches(/^[0-9]+$/).withMessage('Phone number must contain only digits'),
        body('profilePicture').optional().isURL().withMessage('Profile picture must be a valid URL'),
        body('sex').isIn(['MALE', 'FEMALE']).withMessage('Sex must be either male, female, or other')
    ];
}
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
module.exports = { signupValidationRules, loginValidationRules, googleLoginValidationRules, updateUserDataValidationRules, validateRequest };