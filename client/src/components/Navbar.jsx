import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Navbar = () => {
  const [isAsignacionesOpen, setIsAsignacionesOpen] = useState(false);
  const [isInventarioOpen, setIsInventarioOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-green-600 text-white flex flex-col">
      <div className="p-6 text-center border-b border-green-500">
        <h1 className="text-2xl font-bold">CTGI Inventory</h1>
      </div>
      <nav className="flex-1 p-4 space-y-4">
        {/* Inicio */}
        <Link
          to="/dashboard"
          className="flex items-center py-2 px-4 rounded hover:bg-green-500 transition"
        >
          <i className="fas fa-home mr-2"></i> Inicio
        </Link>

        {/* Usuarios */}
        <Link
          to="/dashboard/usuarios"
          className="flex items-center py-2 px-4 rounded hover:bg-green-500 transition"
        >
          <i className="fas fa-users mr-2"></i> Usuarios
        </Link>

        {/* Asignaciones */}
        <div>
          <button
            onClick={() => setIsAsignacionesOpen(!isAsignacionesOpen)}
            className="flex items-center justify-between w-full py-2 px-4 rounded hover:bg-green-500 transition"
          >
            <div className="flex items-center">
              <i className="fas fa-edit mr-2"></i> Asignaciones
            </div>
            <i
              className={`fas fa-chevron-down transition-transform ${
                isAsignacionesOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>
          {isAsignacionesOpen && (
            <div className="ml-6 mt-2 space-y-2">
              <Link
                to="/dashboard/asignaciones/detalles"
                className="block py-2 px-4 rounded hover:bg-green-500 transition"
              >
                Detalles Asignaciones
              </Link>
              <Link
                to="/dashboard/asignaciones/grupo"
                className="block py-2 px-4 rounded hover:bg-green-500 transition"
              >
                Grupo
              </Link>
            </div>
          )}
        </div>

        {/* Inventario */}
        <div>
          <button
            onClick={() => setIsInventarioOpen(!isInventarioOpen)}
            className="flex items-center justify-between w-full py-2 px-4 rounded hover:bg-green-500 transition"
          >
            <div className="flex items-center">
              <i className="fas fa-boxes mr-2"></i> Inventario
            </div>
            <i
              className={`fas fa-chevron-down transition-transform ${
                isInventarioOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>
          {isInventarioOpen && (
            <div className="ml-6 mt-2 space-y-2">
              <Link
                to="/dashboard/inventario/equipos-tecnologicos"
                className="block py-2 px-4 rounded hover:bg-green-500 transition"
              >
                Equipos Tecnológicos
              </Link>
              <Link
                to="/dashboard/inventario/productos-consumibles"
                className="block py-2 px-4 rounded hover:bg-green-500 transition"
              >
                Productos Consumibles
              </Link>
            </div>
          )}
        </div>

        {/* Reportes */}
        <Link
          to="/dashboard/reportes"
          className="flex items-center py-2 px-4 rounded hover:bg-green-500 transition"
        >
          <i className="fas fa-chart-line mr-2"></i> Reportes
        </Link>
      </nav>
      <div className="p-4 border-t border-green-500">
        <button className="w-full py-2 px-4 bg-red-500 rounded hover:bg-red-600 transition" onClick={logout}>
          <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Navbar;