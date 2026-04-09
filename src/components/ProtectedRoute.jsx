import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UseAuth";

function ProtectedRoute({ children, allowedRoles = [],path }) {
  const { user, loading } = useAuth();

  const location = useLocation();

  // Wait for auth state to resolve before redirecting
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-800">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-surface-400 font-sans">Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect to login, preserve intended destination
  if (!user) {
    return <Navigate to={path} replace state={{ from: location,screen: "login" }} />;
  }

  // Logged in but wrong role — redirect to their correct home
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const fallback = user.role === "admin" ? "/admin/overview" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}

export default ProtectedRoute;