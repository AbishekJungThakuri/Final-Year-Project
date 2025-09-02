import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role, isAuthenticated } = useSelector((state) => state.auth);


   if (!isAuthenticated || !token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Logged in but role not allowed → redirect to home
    return <Navigate to="/" />;
  }

  // Allowed → render child routes
  return <Outlet />;
};

export default ProtectedRoute;

