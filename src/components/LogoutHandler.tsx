import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const LogoutHandler = () => {
  useEffect(() => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("vendorId");
  }, []);

  return <Navigate to="/login" replace />;
};

export default LogoutHandler;