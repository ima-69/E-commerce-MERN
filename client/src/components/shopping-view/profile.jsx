import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, Save, User, Lock, Eye, EyeOff, Upload, X, Check } from "lucide-react";
import { 
  updateUserProfile, 
  uploadProfilePicture, 
  deleteProfilePicture,
  getUserProfile,
  changePassword
} from "@/store/auth-slice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(updateUserProfile(formData));
      
      if (result?.payload?.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        const msg = result?.payload?.message || "Failed to update profile";
        toast.error(msg);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      userName: user?.userName || '',
      email: user?.email || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) {
      toast.error("Please fill in all password fields correctly");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(changePassword(passwordData));
      
      if (result?.payload?.success) {
        toast.success("Password changed successfully");
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordChange(false);
      } else {
        const msg = result?.payload?.message || "Failed to change password";
        toast.error(msg);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
    setShowPasswordChange(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const result = await dispatch(uploadProfilePicture(file));
      
      if (result?.payload?.success) {
        toast.success("Profile picture updated successfully");
        setUploadSuccess(true);
        setPreviewImage(null); // Clear preview after successful upload
        
        // Hide success animation after 2 seconds
        setTimeout(() => {
          setUploadSuccess(false);
        }, 2000);
      } else {
        const msg = result?.payload?.message || "Failed to upload profile picture";
        toast.error(msg);
        setPreviewImage(null); // Clear preview on error
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setPreviewImage(null); // Clear preview on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePicture = async () => {
    if (!user?.profilePicture) return;

    setIsLoading(true);
    try {
      const result = await dispatch(deleteProfilePicture());
      
      if (result?.payload?.success) {
        toast.success("Profile picture deleted successfully");
      } else {
        const msg = result?.payload?.message || "Failed to delete profile picture";
        toast.error(msg);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Load user profile when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user?.id]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userName: user.userName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.userName) {
      return user.userName[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Profile Information */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gray-200 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            Profile Information
          </CardTitle>
          <CardDescription className="text-gray-600">
            Manage your account settings and profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              {/* Main Avatar Display */}
              <div className="relative">
                <Avatar className={`h-32 w-32 ring-4 shadow-lg transition-all duration-300 ${
                  uploadSuccess 
                    ? 'ring-green-400 scale-105' 
                    : 'ring-gray-100'
                }`}>
                  <AvatarImage 
                    src={previewImage || user?.profilePicture} 
                    alt="Profile" 
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gray-200 text-gray-700">
                    {getInitials()}
                  </AvatarFallback>
                  
                  {/* Success Checkmark */}
                  {uploadSuccess && (
                    <div className="absolute inset-0 bg-green-500 bg-opacity-90 rounded-full flex items-center justify-center animate-pulse">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </Avatar>
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 rounded-full p-0 bg-white/20 hover:bg-white/30 border-white/30"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isLoading}
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Camera className="h-5 w-5 text-white" />
                    )}
                  </Button>
                </div>

                {/* Upload Progress Indicator */}
                {isUploading && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-white rounded-full px-3 py-1 shadow-lg flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent" />
                      <span className="text-xs font-medium text-gray-700">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isUploading || isLoading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Uploaded!
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </>
                )}
              </Button>
              
              {user?.profilePicture && (
                <Button
                  variant="outline"
                  onClick={handleDeletePicture}
                  disabled={isUploading || isLoading}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>

            {/* Upload Guidelines */}
            <div className="text-center text-sm text-gray-500 max-w-sm">
              <p>Upload a clear photo of yourself</p>
              <p>JPG, PNG up to 5MB</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={errors.userName ? 'border-red-500' : ''}
                />
                {errors.userName && (
                  <p className="text-sm text-red-500">{errors.userName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="w-full"
              >
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="flex items-center gap-2 flex-1"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Right Column - Change Password */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Lock className="h-5 w-5 text-gray-600" />
            </div>
            Change Password
          </CardTitle>
          <CardDescription className="text-gray-600">
            Update your account password for better security
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showPasswordChange ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Your Account</h3>
                <p className="text-gray-600 mb-6">
                  Keep your account safe by regularly updating your password
                </p>
              </div>
              <Button 
                onClick={() => setShowPasswordChange(true)}
                variant="outline"
                className="w-full"
              >
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`pl-10 pr-10 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.current ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`pl-10 pr-10 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`pl-10 pr-10 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handlePasswordSubmit} 
                  disabled={isLoading}
                  className="flex items-center gap-2 flex-1"
                >
                  <Lock className="h-4 w-4" />
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePasswordCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
