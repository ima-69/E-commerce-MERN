import React, { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { toast } from "sonner";
import { loginUser } from "@/store/auth-slice";

const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect URL from query params (either 'redirect' or 'returnTo')
  const redirectTo = new URLSearchParams(location.search).get('redirect') || 
                     new URLSearchParams(location.search).get('returnTo');

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
    } else {
      // If no token, redirect directly to Auth0
      const auth0Url = redirectTo 
        ? `http://localhost:5000/api/auth0/login?redirect=${encodeURIComponent(redirectTo)}`
        : "http://localhost:5000/api/auth0/login";
      
      window.location.href = auth0Url;
    }
  }, [location.search, dispatch, navigate, redirectTo]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Auth0...</p>
      </div>
    </div>
  );
};

export default AuthLogin;
