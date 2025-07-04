import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, requiredPermission }) => {
  const { role, permissions } = useSelector((state) => state.auth);

  if (!role || !permissions) {
    return <div>Loading...</div>;
  }

  const roleName = role;

  // Super-admin check
  if (roleName === "super-admin") {
    return element;
  }

  // If no specific permission required, allow access (optional)
  if (!requiredPermission) {
    return element;
  }

  // Check if user has permission
  const hasPermission = permissions.includes(requiredPermission);

  if (hasPermission) {
    return element;
  }

  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
