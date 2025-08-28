import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  // Mientras se verifica la autenticación, mostramos un indicador de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-700">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigimos a login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirigir a dashboard o mostrar acceso denegado
  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/dashboard" />;
    // Alternativa: mostrar un mensaje de acceso denegado en lugar de redirigir
    // return (
    //   <div className="flex justify-center items-center h-screen bg-gray-100">
    //     <div className="p-4 bg-white rounded shadow text-red-600">
    //       <p>Acceso denegado. No tienes los permisos necesarios.</p>
    //     </div>
    //   </div>
    // );
  }

  // Si el usuario está autenticado (y tiene el rol requerido si se especificó), mostramos el contenido
  return children;
};

export default ProtectedRoute;