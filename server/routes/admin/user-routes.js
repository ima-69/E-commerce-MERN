const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats
} = require('../../controllers/admin/user-controller');
const { adminMiddleware } = require('../../middleware/auth');

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user status
router.put('/:id/status', updateUserStatus);

// Delete user
router.delete('/:id', deleteUser);

// Get user statistics
router.get('/stats/overview', getUserStats);

module.exports = router;
