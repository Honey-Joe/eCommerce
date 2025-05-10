// src/components/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { role } = useSelector((state) => state.auth);

  // If role is still null/undefined (i.e., auth check not finished), show loading
  if (role === null || role === undefined) {
    return <div>Loading...</div>; // or a spinner
  }

  // If role is not authorized
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
