import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  
  console.log("Estado del usuario en ProtectedRoute:", user);

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;