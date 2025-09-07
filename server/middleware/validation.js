const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};

// Common validation rules
const commonValidations = {
    // Email validation
    email: body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .trim(),

    // Password validation
    password: body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    // Name validation
    firstName: body('firstName')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces')
        .trim(),

    lastName: body('lastName')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces')
        .trim(),

    // Username validation
    userName: body('userName')
        .isLength({ min: 3, max: 150 })
        .withMessage('Username must be between 3 and 150 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
        .trim(),

    // Search keyword validation
    searchKeyword: param('keyword')
        .isLength({ min: 1, max: 100 })
        .withMessage('Search keyword must be between 1 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_.,!?]+$/)
        .withMessage('Search keyword contains invalid characters')
        .trim(),

    // Product validation
    productTitle: body('title')
        .isLength({ min: 3, max: 200 })
        .withMessage('Product title must be between 3 and 200 characters')
        .trim(),

    productDescription: body('description')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Product description must be between 10 and 2000 characters')
        .trim(),

    productPrice: body('price')
        .isFloat({ min: 0.01, max: 999999.99 })
        .withMessage('Price must be a valid number between 0.01 and 999999.99'),

    productStock: body('stock')
        .isInt({ min: 0, max: 999999 })
        .withMessage('Stock must be a valid integer between 0 and 999999'),

    // Address validation
    addressLine1: body('addressLine1')
        .isLength({ min: 5, max: 200 })
        .withMessage('Address line 1 must be between 5 and 200 characters')
        .trim(),

    addressLine2: body('addressLine2')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Address line 2 must not exceed 200 characters')
        .trim(),

    city: body('city')
        .isLength({ min: 2, max: 100 })
        .withMessage('City must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('City can only contain letters and spaces')
        .trim(),

    state: body('state')
        .isLength({ min: 2, max: 100 })
        .withMessage('State must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('State can only contain letters and spaces')
        .trim(),

    postalCode: body('postalCode')
        .isLength({ min: 3, max: 20 })
        .withMessage('Postal code must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9\s-]+$/)
        .withMessage('Postal code contains invalid characters')
        .trim(),

    country: body('country')
        .isLength({ min: 2, max: 100 })
        .withMessage('Country must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Country can only contain letters and spaces')
        .trim(),

    // Review validation
    reviewRating: body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),

    reviewComment: body('comment')
        .isLength({ min: 10, max: 500 })
        .withMessage('Review comment must be between 10 and 500 characters')
        .trim(),

    // ObjectId validation
    objectId: param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),

    // Pagination validation
    page: query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    limit: query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
};

// Validation rule sets for different endpoints
const validationRules = {
    // Auth validations
    register: [
        commonValidations.firstName,
        commonValidations.lastName,
        commonValidations.userName,
        commonValidations.email,
        commonValidations.password,
        handleValidationErrors
    ],

    login: [
        body('emailOrUsername')
            .notEmpty()
            .withMessage('Email or username is required')
            .isLength({ min: 3, max: 150 })
            .withMessage('Email or username must be between 3 and 150 characters')
            .trim(),
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
        handleValidationErrors
    ],

    forgotPassword: [
        commonValidations.email,
        handleValidationErrors
    ],

    resetPassword: [
        body('token')
            .notEmpty()
            .withMessage('Reset token is required')
            .isLength({ min: 32, max: 64 })
            .withMessage('Invalid reset token format'),
        commonValidations.password,
        handleValidationErrors
    ],

    changePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        commonValidations.password,
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Password confirmation does not match');
                }
                return true;
            }),
        handleValidationErrors
    ],

    // Profile validations
    updateProfile: [
        commonValidations.firstName,
        commonValidations.lastName,
        handleValidationErrors
    ],

    // Search validation
    searchProducts: [
        commonValidations.searchKeyword,
        handleValidationErrors
    ],

    // Product validations
    createProduct: [
        commonValidations.productTitle,
        commonValidations.productDescription,
        commonValidations.productPrice,
        commonValidations.productStock,
        body('category')
            .isLength({ min: 2, max: 100 })
            .withMessage('Category must be between 2 and 100 characters')
            .trim(),
        body('brand')
            .isLength({ min: 2, max: 100 })
            .withMessage('Brand must be between 2 and 100 characters')
            .trim(),
        handleValidationErrors
    ],

    updateProduct: [
        commonValidations.objectId,
        commonValidations.productTitle.optional(),
        commonValidations.productDescription.optional(),
        commonValidations.productPrice.optional(),
        commonValidations.productStock.optional(),
        handleValidationErrors
    ],

    // Address validations
    createAddress: [
        commonValidations.addressLine1,
        commonValidations.addressLine2,
        commonValidations.city,
        commonValidations.state,
        commonValidations.postalCode,
        commonValidations.country,
        body('isDefault')
            .optional()
            .isBoolean()
            .withMessage('isDefault must be a boolean value'),
        handleValidationErrors
    ],

    // Review validations
    createReview: [
        commonValidations.objectId,
        commonValidations.reviewRating,
        commonValidations.reviewComment,
        handleValidationErrors
    ],

    // Cart validations
    addToCart: [
        body('userId')
            .isMongoId()
            .withMessage('Valid user ID is required'),
        body('productId')
            .isMongoId()
            .withMessage('Valid product ID is required'),
        body('quantity')
            .isInt({ min: 1, max: 99 })
            .withMessage('Quantity must be between 1 and 99'),
        handleValidationErrors
    ],

    updateCartItem: [
        body('productId')
            .isMongoId()
            .withMessage('Valid product ID is required'),
        body('quantity')
            .isInt({ min: 0, max: 99 })
            .withMessage('Quantity must be between 0 and 99'),
        handleValidationErrors
    ],

    // Order validations
    createOrder: [
        body('items')
            .isArray({ min: 1 })
            .withMessage('Order must contain at least one item'),
        body('items.*.productId')
            .isMongoId()
            .withMessage('Invalid product ID'),
        body('items.*.quantity')
            .isInt({ min: 1, max: 99 })
            .withMessage('Invalid quantity'),
        body('shippingAddress')
            .isObject()
            .withMessage('Shipping address is required'),
        body('paymentMethod')
            .isIn(['paypal', 'stripe', 'cod'])
            .withMessage('Invalid payment method'),
        handleValidationErrors
    ],

    // Generic validations
    getById: [
        commonValidations.objectId,
        handleValidationErrors
    ],

    // Cart specific validations
    getCartByUserId: [
        param('userId')
            .isMongoId()
            .withMessage('Valid user ID is required'),
        handleValidationErrors
    ],

    pagination: [
        commonValidations.page,
        commonValidations.limit,
        handleValidationErrors
    ]
};

module.exports = {
    validationRules,
    handleValidationErrors,
    commonValidations
};
