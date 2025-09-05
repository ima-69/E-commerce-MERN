const { body, param, query, validationResult } = require('express-validator');
const { createError } = require('./errorHandler');

// Validation result handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    throw createError.validation(`Validation failed: ${errorMessages.map(e => e.message).join(', ')}`);
  }
  next();
};

// Auth validation rules
const authValidation = {
  register: [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('userName')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  ],

  login: [
    body('emailOrUsername')
      .trim()
      .notEmpty()
      .withMessage('Email or username is required'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  forgotPassword: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
  ],

  resetPassword: [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  ],
};

// Product validation rules
const productValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Product title is required')
      .isLength({ min: 3, max: 100 })
      .withMessage('Product title must be between 3 and 100 characters'),
    
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Product description is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Product description must be between 10 and 1000 characters'),
    
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Product category is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Category must be between 2 and 50 characters'),
    
    body('brand')
      .trim()
      .notEmpty()
      .withMessage('Product brand is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Brand must be between 2 and 50 characters'),
    
    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be greater than 0'),
    
    body('salePrice')
      .optional()
      .isNumeric()
      .withMessage('Sale price must be a number')
      .isFloat({ min: 0.01 })
      .withMessage('Sale price must be greater than 0'),
    
    body('totalStock')
      .isInt({ min: 0 })
      .withMessage('Total stock must be a non-negative integer'),
    
    body('averageReview')
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage('Average review must be between 0 and 5'),
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),
    
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Product title must be between 3 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Product description must be between 10 and 1000 characters'),
    
    body('category')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Category must be between 2 and 50 characters'),
    
    body('brand')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Brand must be between 2 and 50 characters'),
    
    body('price')
      .optional()
      .isNumeric()
      .withMessage('Price must be a number')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be greater than 0'),
    
    body('salePrice')
      .optional()
      .isNumeric()
      .withMessage('Sale price must be a number')
      .isFloat({ min: 0.01 })
      .withMessage('Sale price must be greater than 0'),
    
    body('totalStock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Total stock must be a non-negative integer'),
    
    body('averageReview')
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage('Average review must be between 0 and 5'),
  ],

  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID'),
  ],
};

// Cart validation rules
const cartValidation = {
  addToCart: [
    body('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
    
    body('productId')
      .isMongoId()
      .withMessage('Invalid product ID'),
    
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
  ],

  updateQuantity: [
    body('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
    
    body('productId')
      .isMongoId()
      .withMessage('Invalid product ID'),
    
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer'),
  ],

  deleteItem: [
    param('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
    
    param('productId')
      .isMongoId()
      .withMessage('Invalid product ID'),
  ],

  getCart: [
    param('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
  ],
};

// Order validation rules
const orderValidation = {
  create: [
    body('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
    
    body('cartItems')
      .isArray({ min: 1 })
      .withMessage('Cart items are required and must be an array'),
    
    body('cartItems.*.productId')
      .isMongoId()
      .withMessage('Invalid product ID in cart items'),
    
    body('cartItems.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Invalid quantity in cart items'),
    
    body('addressInfo')
      .isObject()
      .withMessage('Address information is required'),
    
    body('addressInfo.fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required'),
    
    body('addressInfo.address')
      .trim()
      .notEmpty()
      .withMessage('Address is required'),
    
    body('addressInfo.city')
      .trim()
      .notEmpty()
      .withMessage('City is required'),
    
    body('addressInfo.state')
      .trim()
      .notEmpty()
      .withMessage('State is required'),
    
    body('addressInfo.zipCode')
      .trim()
      .notEmpty()
      .withMessage('ZIP code is required'),
    
    body('addressInfo.country')
      .trim()
      .notEmpty()
      .withMessage('Country is required'),
    
    body('totalAmount')
      .isNumeric()
      .withMessage('Total amount must be a number')
      .isFloat({ min: 0.01 })
      .withMessage('Total amount must be greater than 0'),
    
    body('paymentMethod')
      .isIn(['paypal', 'stripe', 'cash_on_delivery'])
      .withMessage('Invalid payment method'),
  ],

  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID'),
  ],

  updateStatus: [
    param('id')
      .isMongoId()
      .withMessage('Invalid order ID'),
    
    body('orderStatus')
      .isIn(['pending', 'confirmed', 'inProcess', 'inShipping', 'delivered', 'cancelled'])
      .withMessage('Invalid order status'),
  ],
};

// User validation rules
const userValidation = {
  updateStatus: [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),
    
    body('isActive')
      .isBoolean()
      .withMessage('isActive must be a boolean value'),
  ],

  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid user ID'),
  ],
};

// Profile validation rules
const profileValidation = {
  update: [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('userName')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  ],
};

// Search validation rules
const searchValidation = {
  search: [
    query('q')
      .trim()
      .notEmpty()
      .withMessage('Search query is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
};

// Review validation rules
const reviewValidation = {
  create: [
    body('productId')
      .isMongoId()
      .withMessage('Invalid product ID'),
    
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    
    body('comment')
      .trim()
      .notEmpty()
      .withMessage('Comment is required')
      .isLength({ min: 10, max: 500 })
      .withMessage('Comment must be between 10 and 500 characters'),
  ],
};

module.exports = {
  handleValidationErrors,
  authValidation,
  productValidation,
  cartValidation,
  orderValidation,
  userValidation,
  profileValidation,
  searchValidation,
  reviewValidation,
};
