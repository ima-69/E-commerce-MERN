import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from "sonner";
import { loginUser } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

const initialState = {
  emailOrUsername: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect URL from query params
  const redirectTo = new URLSearchParams(location.search).get('redirect');

  const validateForm = () => {
    const newErrors = {};

    // Email or Username validation
    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email or username is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
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

  const onSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await dispatch(loginUser(formData));
      
      if (result?.payload?.success) {
        toast.success(result.payload.message || "Login successful");
        
        // Redirect based on user role or redirect URL
        const userRole = result?.payload?.user?.role;
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else {
          // If there's a redirect URL, go there, otherwise go to home
          navigate(redirectTo || "/shop/home");
        }
      } else {
        // Handle specific error messages
        const errorMsg = result?.payload?.message || result?.error?.message || "";
        
        if (errorMsg?.includes("Incorrect password") || errorMsg?.includes("password")) {
          toast.error("❌ Incorrect password. Please check your password and try again.");
        } else if (errorMsg?.includes("Account is deactivated") || errorMsg?.includes("deactivated")) {
          toast.error("🚫 Your account has been deactivated. Please contact support for assistance.");
        } else if (errorMsg?.includes("User not found") || errorMsg?.includes("User doesn't exist") || errorMsg?.includes("doesn't exist")) {
          toast.error("👤 User not found. Please check your email/username or register a new account.");
        } else if (errorMsg?.includes("Too many requests") || errorMsg?.includes("rate limit")) {
          toast.error("⏰ Too many login attempts. Please wait a few minutes before trying again.");
        } else if (errorMsg?.includes("Unauthorized") || errorMsg?.includes("401")) {
          toast.error("🔒 Login failed. Please check your credentials and try again.");
        } else if (errorMsg?.includes("Network Error") || errorMsg?.includes("timeout")) {
          toast.error("🌐 Network error. Please check your internet connection and try again.");
        } else if (errorMsg) {
          // Show the actual error message if it's user-friendly
          toast.error(`❌ ${errorMsg}`);
        } else {
          toast.error("❌ Login failed. Please check your credentials and try again.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("❌ An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          <CardDescription>
            Don't have an account?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              to="/auth/register"
            >
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email or Username */}
            <div className="space-y-2">
              <Label htmlFor="emailOrUsername">Email or Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  placeholder="Enter your email or username"
                  value={formData.emailOrUsername}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.emailOrUsername ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {errors.emailOrUsername && (
                <p className="text-sm text-red-500">{errors.emailOrUsername}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLogin;