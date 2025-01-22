// components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "nope@nope.com"; // We'll move this to env variables later

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
