import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(UserContext);

  // ⏳ Wait until user is fetched
  if (loading) return null;

  // ❌ If no user → send to Login page
  if (!user) {
    return <Navigate to="/login" replace />;  // <-- redirect to login
  }

  // ❌ If role not allowed → block access
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; // optional page
  }

  // ✔ User allowed → show the page
  return children;
}