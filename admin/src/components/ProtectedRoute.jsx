// src/components/ProtectedRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredPermission }) => {
  const { role, permissions } = useSelector((state) => state.auth);

  const isSuperAdmin = role === "super-admin";
  const hasPermission = permissions?.includes(requiredPermission);

  if (isSuperAdmin || hasPermission) {
    return element;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
