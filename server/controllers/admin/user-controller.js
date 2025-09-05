const User = require('../../models/User');
const { asyncHandler, createError } = require("../../utils/errorHandler");
const logger = require("../../utils/logger");

// Get all users for admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
  
  logger.info('All users fetched for admin', { count: users.length });
  
  res.status(200).json({
    success: true,
    data: users,
    message: 'Users fetched successfully'
  });
});

// Get user by ID for admin
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id, { password: 0 });
  
  if (!user) {
    throw createError.notFound('User not found');
  }
  
  logger.info('User details fetched for admin', { userId: id });
  
  res.status(200).json({
    success: true,
    data: user,
    message: 'User fetched successfully'
  });
});


// Update user status (activate/deactivate)
const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  
  if (typeof isActive !== 'boolean') {
    throw createError.badRequest('isActive must be a boolean value');
  }
  
  // Check if user is trying to deactivate themselves
  if (req.user && req.user.id && req.user.id.toString() === id) {
    throw createError.badRequest('You cannot deactivate your own account');
  }
  
  const user = await User.findByIdAndUpdate(
    id,
    { isActive },
    { new: true, select: '-password' }
  );
  
  if (!user) {
    throw createError.notFound('User not found');
  }
  
  logger.info('User status updated', { 
    userId: id, 
    isActive, 
    updatedBy: req.user?.id 
  });
  
  res.status(200).json({
    success: true,
    data: user,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
  });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Prevent admin from deleting themselves
  if (req.user && req.user.id && req.user.id.toString() === id) {
    throw createError.badRequest('You cannot delete your own account');
  }
  
  const user = await User.findByIdAndDelete(id);
  
  if (!user) {
    throw createError.notFound('User not found');
  }
  
  logger.info('User deleted by admin', { 
    deletedUserId: id, 
    deletedBy: req.user?.id,
    userEmail: user.email
  });
  
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Get user statistics
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  const adminUsers = await User.countDocuments({ role: 'admin' });
  const regularUsers = await User.countDocuments({ role: 'user' });
  
  // Get users created in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = await User.countDocuments({ 
    createdAt: { $gte: thirtyDaysAgo } 
  });
  
  const stats = {
    totalUsers,
    activeUsers,
    inactiveUsers,
    adminUsers,
    regularUsers,
    newUsers
  };
  
  logger.info('User statistics fetched', stats);
  
  res.status(200).json({
    success: true,
    data: stats,
    message: 'User statistics fetched successfully'
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats
};
