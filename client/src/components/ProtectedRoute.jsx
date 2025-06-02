// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { role } = useSelector((state) => state.auth);

  // If role is still null/undefined (i.e., auth check not finished), show loading
  if (role === null || role === undefined) {
    return <div>Loading...</div>;
  }

  if(role === "not") {
    return <Navigate to="/user/login" replace />;
  }

  // If role is not authorized
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
