import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UseAuth";

function ProtectedRoute({ children, allowedRoles = [], path }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const token = localStorage.getItem("token");

  if (loading) {
    return null; // or loader
  }

  if (!token) {
    return (
      <Navigate
        to={path}
        replace
        state={{ from: location, screen: "login" }}
      />
    );
  }

  if (!user) {
    return;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const fallback =
      user.role === "admin" ? "/admin/overview" : "/dashboard";

    return <Navigate to={fallback} replace />;
  }

  return children;
}

export default ProtectedRoute;