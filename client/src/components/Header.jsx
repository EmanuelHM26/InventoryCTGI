import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
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
            <p className="text-gray-700 font-semibold">Emanuel Huertas</p>
            <p className="text-gray-500 text-sm">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;