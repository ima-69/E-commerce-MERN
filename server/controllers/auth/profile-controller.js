const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const { imageUploadUtil } = require("../../helpers/cloudinary");
const { asyncHandler, createError } = require("../../utils/errorHandler");
const logger = require("../../utils/logger");

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      logger.warn("No user ID in request", { ip: req.ip });
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    
    const user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpires");
    
    if (!user) {
      logger.warn("User not found in database", { userId, ip: req.ip });
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    logger.error("Get user profile error:", { error: error.message, userId: req.user?.id, ip: req.ip });
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, userName, email } = req.body;

    // Check if username or email already exists (excluding current user)
    if (userName) {
      const existingUserByUsername = await User.findOne({ 
        userName, 
        _id: { $ne: userId } 
      });
      if (existingUserByUsername) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }
    }

    if (email) {
      const existingUserByEmail = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUserByEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    // Update user profile
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    logger.error("Update user profile error:", { error: error.message, userId });
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    // Get current user to check if they have an existing profile picture
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // If user has an existing profile picture, delete it from Cloudinary
    if (currentUser.profilePicture) {
      try {
        const publicId = currentUser.profilePicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
      } catch (cloudinaryError) {
        logger.warn("Cloudinary deletion error:", { error: cloudinaryError.message, userId });
        // Continue with upload even if deletion fails
      }
    }

    // Upload to Cloudinary using the existing helper
    const result = await imageUploadUtil(req.file);

    // Update user profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: updatedUser
    });
  } catch (error) {
    logger.error("Upload profile picture error:", { error: error.message, userId });
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Delete profile picture
const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current user to check if they have a profile picture
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // If user has a profile picture, delete it from Cloudinary
    if (user.profilePicture) {
      try {
        const publicId = user.profilePicture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
      } catch (cloudinaryError) {
        logger.warn("Cloudinary deletion error:", { error: cloudinaryError.message, userId });
        // Continue with database update even if Cloudinary deletion fails
      }
    }

    // Update user to remove profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: null },
      { new: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

    res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully",
      user: updatedUser
    });
  } catch (error) {
    logger.error("Delete profile picture error:", { error: error.message, userId });
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long"
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(userId, { password: hashedNewPassword });

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    logger.error("Change password error:", { error: error.message, userId });
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  changePassword
};
