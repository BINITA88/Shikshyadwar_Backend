const { check, validationResult } = require('express-validator');

// category validation
exports.categoryValidation = [
    check('category_name', 'Category is mandatory').notEmpty()
        .isLength({ min: 3 }).withMessage('category name must be at least 3 characters.')
];

// validation bahnni function le kaam garesi arko lai pathauna next use huncha

// productValidation
exports.productValidation = [
    check('product_name', 'product is mandatory').notEmpty()
        .isLength({ min: 3 }).withMessage('product name must be at least 3 characters.'),

    check('product_price', 'product price is mandatory').notEmpty()
        .isNumeric().withMessage('product price must be numeric values only.'),

    // check('countInStock','countInStock is mandatory').notEmpty()
    // .isNumeric().withMessage('countInStock must be numeric values only.'),

    check('product_description', 'product description is mandatory').notEmpty()
        .isLength({ min: 20 }).withMessage('product description should be at least 20 characters.'),

    check('category', 'category is mandatory').notEmpty()
];

// General validation handler
exports.validation = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
};

// // user validation
// exports.userValidation = [
//     check('name', 'name is mandatory').notEmpty()
//         .isLength({ min: 3 }).withMessage('name must be at least 3 characters.'),

//     check('email', 'email is mandatory').notEmpty()
//         .isEmail().withMessage('invalid email format'),
// ];
exports.userValidation = [
    check('name', 'name is mandatory').notEmpty()
        .isLength({ min: 3 }).withMessage('name must be at least 3 characters.'),

    check('email', 'email is mandatory').notEmpty()
        .isEmail().withMessage('invalid email format'),

    // check('contact_no', 'contact_no is mandatory').notEmpty()
    //     .isNumeric().withMessage('contact_no must contain numeric values only')
    //     .isLength({ min: 10 }).withMessage('contact_no must be at least 10 digits')
];

// RESET WALA HARU GARNA PARCHA SO 

exports.passwordValidation = [
    check('password', 'password is mandatory').notEmpty()
        .matches(/[a-z]/).withMessage('password must contain at least one lower case alphabet')
        .matches(/[A-Z]/).withMessage('password must contain at least one upper case alphabet')
        .matches(/[0-9]/).withMessage('password must contain at least one numeric value')
        .matches(/[@#$_!?]/).withMessage('password must contain at least one special character')
        .isLength({ min: 8 }).withMessage('PASSWORD MUST CONTAIN AT LEAST 8 CHARACTERS')
];
