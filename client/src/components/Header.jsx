import React, { useEffect } from "react";
import { useAuth } from "../context/authContext";


const Header = () => {
  const { user, loading } = useAuth();

  // Log para depuración
  useEffect(() => {
    console.log("Estado del usuario en Header:", user);
  }, [user]);

  if (loading) {
    return (
      <header className="absolute top-0 left-0 w-[calc(100%-16rem)] ml-64 bg-white shadow p-4 flex justify-between items-center z-50">
        <h2 className="text-xl font-semibold text-gray-700">Cargando...</h2>
      </header>
    );
  }

  return (
    <header className="absolute top-0 left-0 w-[calc(100%-16rem)] ml-64 bg-white shadow p-4 flex justify-between items-center z-50">
      <h2 className="text-xl font-semibold text-gray-700">
        Bienvenido, {user?.nombre || "Usuario"}
      </h2>
      <div className="flex items-center space-x-4">
        <i className="fas fa-bell text-gray-600"></i>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
          </div>
          {/* Buscador global */}
          
          <div>
            <p className="text-gray-700 font-semibold">
              {user?.nombre || "Usuario"}
            </p>
            <p className="text-green-600 text-sm font-medium">
              {user?.rol || "Rol"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;