import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  FaHome,
  FaUsers,
  FaEdit,
  FaBoxes,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  const [isAsignacionesOpen, setIsAsignacionesOpen] = useState(false);
  const [isInventarioOpen, setIsInventarioOpen] = useState(false);
  const { logout } = useAuth();

  const linkClasses =
    "flex items-center w-full py-1 px-4 rounded-l hover:bg-white/10 hover:border-l-4 hover:border-white/90 transition-colors duration-200";

  return (
    <aside className="w-64 bg-green-800 text-white flex flex-col min-h-screen">
      <div className="p-4 text-center border-b border-white">
        <h1 className="text-2xl font-bold">Inventario CTGI</h1>
      </div>

      <nav className="flex-1 p-2 space-y-2">
        {/* Inicio */}
        <Link to="/dashboard/inicio" className={linkClasses}>
          <FaHome className="mr-1" /> Inicio
        </Link>

        {/* Usuarios */}
        <Link to="/dashboard/usuarios" className={linkClasses}>
          <FaUsers className="mr-1" /> Usuarios
        </Link>

        {/* Asignaciones */}
        <div>
          <button
            onClick={() => setIsAsignacionesOpen(!isAsignacionesOpen)}
            className={`${linkClasses} w-full justify-between`}
          >
            <div className="flex items-center">
              <FaEdit className="mr-1" /> Asignaciones
            </div>
            <IoIosArrowDown
              className={`transition-transform ${isAsignacionesOpen ? "rotate-180" : ""
                }`}
            />
          </button>
          {isAsignacionesOpen && (
            <div className="ml-6 mt-1 space-y-1">

              <Link
                to="/dashboard/asignaciones"
                className="flex items-center py-1 px-2 rounded-l hover:bg-white/10 hover:border-l-4 hover:border-white/90 transition-colors duration-200"
              >
                Asignaciones
              </Link>
              <Link
                to="/dashboard/asignaciones/detalles"
                className="flex items-center py-1 px-2 rounded-l hover:bg-white/10 hover:border-l-4 hover:border-white/90 transition-colors duration-200"
              >
                Detalles de Asignación
              </Link>
              <Link
                to="/dashboard/asignaciones/grupo"
                className="flex items-center py-1 px-2 rounded-l hover:bg-white/10 hover:border-l-4 hover:border-white/90 transition-colors duration-200"
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
            className={`${linkClasses} w-full justify-between`}
          >
            <div className="flex items-center">
              <FaBoxes className="mr-2" /> Inventario
            </div>
            <IoIosArrowDown
              className={`transition-transform ${isInventarioOpen ? "rotate-180" : ""
                }`}
            />
          </button>
          {isInventarioOpen && (
            <div className="ml-6 mt-2 space-y-2">
              <Link
                to="/dashboard/inventario/equipos-tecnologicos"
                className="flex items-center py-2 px-2 rounded-l hover:bg-white/10 hover:border-l-4 hover:border-white/90 transition-colors duration-200"
              >
                Equipos Tecnológicos
              </Link>
              <Link
                to="/dashboard/inventario/productos-consumibles"
                className="flex items-center py-2 px-2 rounded-l hover:bg-white/10 hover:border-l-4 hover:border-white/90 transition-colors duration-200"
              >
                Productos Consumibles
              </Link>
            </div>
          )}
        </div>

        {/* Reportes */}
        <Link to="/dashboard/reportes" className={linkClasses}>
          <FaChartLine className="mr-2" /> Reportes
        </Link>

        <Link to="/dashboard/roles" className={linkClasses}>
          <FaChartLine className="mr-2" /> Roles
        </Link>

        <Link to="/dashboard/usuarios-software" className={linkClasses}>
          <FaUsers className="mr-2" /> Usuarios Software
        </Link>
      </nav>

      {/* Cerrar sesión */}
      <div className="p-4 border-t border-white mt-auto">
        <button onClick={logout} className={linkClasses}>
          <FaSignOutAlt className="mr-2" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
