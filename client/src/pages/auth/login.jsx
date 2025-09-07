import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "sonner";
import { loginUser, logoutUser } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail, LogOut } from "lucide-react";

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
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Get redirect URL from query params
  const redirectTo = new URLSearchParams(location.search).get('redirect');

  // Handle logout for already authenticated users
  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser());
      // If it's not an Auth0 user, navigate after logout
      if (!result.payload?.message?.includes("Redirecting to Auth0 logout")) {
        navigate("/shop/home");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback navigation
      navigate("/shop/home");
    }
  };

  // --- Handle Auth0 login redirect ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const id = params.get('id');
    const role = params.get('role');
    const email = params.get('email');
    const firstName = params.get('firstName');
    const lastName = params.get('lastName');
    const username = params.get('username');

    if (token && id) {
      // Dispatch login to Redux store
      dispatch(loginUser({
        token,
        id,
        role,
        email,
        firstName,
        lastName,
        username
      }));

      toast.success("Logged in via Auth0 successfully!");
      
      // Redirect to home or specified page
      navigate(redirectTo || "/shop/home", { replace: true });
    }
  }, [location.search, dispatch, navigate, redirectTo]);

  // --- EXISTING LOGIN FORM HANDLERS ---
  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailOrUsername.trim()) newErrors.emailOrUsername = "Email or username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
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
        const userRole = result?.payload?.user?.role;
        navigate(userRole === "admin" ? "/admin/dashboard" : redirectTo || "/shop/home", { replace: true });
      } else {
        toast.error(result?.payload?.message || result?.error?.message || "Login failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already authenticated, show logout option
  if (isAuthenticated && user) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Already Signed In</CardTitle>
            <CardDescription>
              You are currently signed in as {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.userName || user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                {user.userName?.startsWith('auth0|') 
                  ? "You signed in with Auth0" 
                  : "You signed in with email/password"}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => navigate("/shop/home")} 
                className="w-full"
              >
                Go to Home
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          <CardDescription>
            Don't have an account?{" "}
            <Link className="font-medium text-primary hover:underline" to="/auth/register">Sign up</Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
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
              {errors.emailOrUsername && <p className="text-sm text-red-500">{errors.emailOrUsername}</p>}
            </div>

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
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
            <br />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => window.location.href = "http://localhost:5000/api/auth0/login"}
              className="w-full mt-2"
            >
              Sign in with Auth0
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthLogin;



// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useDispatch } from 'react-redux';
// import { toast } from "sonner";
// import { loginUser } from "@/store/auth-slice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

// const initialState = {
//   emailOrUsername: "",
//   password: "",
// };

// const AuthLogin = () => {
//   const [formData, setFormData] = useState(initialState);
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Get redirect URL from query params
//   const redirectTo = new URLSearchParams(location.search).get('redirect');

//   const validateForm = () => {
//     const newErrors = {};

//     // Email or Username validation
//     if (!formData.emailOrUsername.trim()) {
//       newErrors.emailOrUsername = "Email or username is required";
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   const onSubmit = async (event) => {
//     event.preventDefault();
    
//     if (!validateForm()) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       const result = await dispatch(loginUser(formData));
      
//       if (result?.payload?.success) {
//         toast.success(result.payload.message || "Login successful");
        
//         // Redirect based on user role or redirect URL
//         const userRole = result?.payload?.user?.role;
//         if (userRole === "admin") {
//           navigate("/admin/dashboard");
//         } else {
//           // If there's a redirect URL, go there, otherwise go to home
//           navigate(redirectTo || "/shop/home");
//         }
//       } else {
//         const msg = result?.payload?.message || result?.error?.message || "Login failed";
//         toast.error(msg);
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto w-full max-w-md space-y-6">
//       <Card>
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
//           <CardDescription>
//             Don't have an account?{" "}
//             <Link
//               className="font-medium text-primary hover:underline"
//               to="/auth/register"
//             >
//               Sign up
//             </Link>
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={onSubmit} className="space-y-4">
//             {/* Email or Username */}
//             <div className="space-y-2">
//               <Label htmlFor="emailOrUsername">Email or Username</Label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="emailOrUsername"
//                   name="emailOrUsername"
//                   type="text"
//                   placeholder="Enter your email or username"
//                   value={formData.emailOrUsername}
//                   onChange={handleInputChange}
//                   className={`pl-10 ${errors.emailOrUsername ? 'border-red-500' : ''}`}
//                   required
//                 />
//               </div>
//               {errors.emailOrUsername && (
//                 <p className="text-sm text-red-500">{errors.emailOrUsername}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff /> : <Eye />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-sm text-red-500">{errors.password}</p>
//               )}
//             </div>

//             <Button
//               type="submit"
//               className="w-full"
//               disabled={isLoading}
//             >
//               {isLoading ? "Signing In..." : "Sign In"}
//             </Button>
//           </form>
          
//           <div className="mt-6 text-center">
//             <Link
//               to="/auth/forgot-password"
//               className="text-sm text-primary hover:underline"
//             >
//               Forgot your password?
//             </Link>
//             <Link to="http://localhost:5000/api/auth0/login">
//       Auth0 Login
//     </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AuthLogin;
