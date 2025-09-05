import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/shop/home",
    "/shop/listing",
    "/shop/search"
  ];

  const isPublicRoute = publicRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route + "/")
  );

  // Handle root path redirect
  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/shop/home" />;
    } else {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    }
  }

  // Allow public access to public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Redirect to login for protected routes if not authenticated
  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/forgot-password") ||
      location.pathname.includes("/reset-password")
    )
  ) {
    // If user was on a protected route and is now not authenticated, 
    // they likely just logged out, so redirect to home instead of login
    if (location.pathname.includes("/admin") || location.pathname.includes("/shop/account")) {
      return <Navigate to="/shop/home" />;
    }
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} />;
  }

  // Redirect authenticated users away from auth pages (except reset-password)
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/forgot-password"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Block non-admin users from admin routes
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Removed the restriction that prevented admins from accessing shop routes
  // Now admins can access both admin and shop routes

  return <>{children}</>;
};

export default CheckAuth;
