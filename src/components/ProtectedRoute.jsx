import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If page requires Admin, but user is a Customer, kick them to Home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If everything is fine, show the page
  return children;
};

export default ProtectedRoute;