import React from "react";
import { useAuth } from "../context/authContext";

const Header = () => {
  const { user } = useAuth(); // Obtener la información del usuario desde el contexto

  console.log("Datos del usuario en Header:", user); // Depuración

  return (
    <header className="absolute top-0 left-0 w-[calc(100%-16rem)] ml-64 bg-white shadow p-4 flex justify-between items-center z-50">
      <h2 className="text-xl font-semibold text-gray-700">Dashboard</h2>
      <div className="flex items-center space-x-4">
        <i className="fas fa-bell text-gray-600"></i>
        <div className="flex items-center space-x-2">
          <img
            src="/path/to/avatar.png" // Cambia esto por la ruta de tu imagen
            alt="Usuario"
            className="w-10 h-10 rounded-full border"
          />
          <div>
            <p className="text-gray-700 font-semibold">
              {user?.Usuario || "Usuario"} {/* Mostrar el nombre del usuario */}
            </p>
            <p className="text-gray-500 text-sm">
              {user?.Rol || "Rol"} {/* Mostrar el rol del usuario */}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;