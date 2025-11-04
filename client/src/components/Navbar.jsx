import React, { useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  FaHome,
  FaUsers,
  FaEdit,
  FaBoxes,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
  FaDoorOpen,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = ({ onToggleCollapse, isCollapsed }) => {
  const [isAsignacionesOpen, setIsAsignacionesOpen] = useState(false);
  const [isInventarioOpen, setIsInventarioOpen] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();

  // VERIFICACIÓN SEGURA DE ROLES
  const isAdmin = user && (
    user.rolId === 1 || 
    user.id === 1 || 
    user.rol === "Administrador" ||
    user.Rol === "Administrador"
  );

  const isSubdirector = user && (
    user.rolId === 2 || 
    user.rol === "Subdirector" ||
    user.Rol === "Subdirector"
  );

  // Usuarios Software visible para Admin y Subdirector
  const canSeeUsuariosSoftware = isAdmin || isSubdirector;
  // Roles visible solo para Admin
  const canSeeRoles = isAdmin;

  // --- Añade UNA de las siguientes según lo que necesites ---
  // Opción A: visible para todos
  const canSeeAmbientes = true;

  // Opción B: visible solo para Admin y Subdirector
  // const canSeeAmbientes = isAdmin || isSubdirector;

  // Opción C: misma regla que Roles
  // const canSeeAmbientes = canSeeRoles;
  
  // Función para determinar si un enlace está activo
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Función para determinar si una sección está activa (para submenús)
  const isSectionActive = (paths) => {
    return paths.some(path => location.pathname === path);
  };

  // Clases para los enlaces principales
  const linkClasses = (path, paths = null) => {
    const baseClasses = "flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out group relative overflow-hidden";
    const isActive = paths ? isSectionActive(paths) : isActiveLink(path);
    
    let activeClasses;
    if (isActive) {
      activeClasses = "bg-white/20 text-white shadow-lg";
    } else {
      activeClasses = "hover:bg-white/10 text-white hover:shadow-md hover:scale-105";
    }
    
    return `${baseClasses} ${activeClasses}`;
  };

  // Clases para subenlaces
  const subLinkClasses = (path) => {
    const baseClasses = "flex items-center py-2 px-3 rounded-lg transition-all duration-300 ease-in-out text-white/90";
    const activeClasses = isActiveLink(path) 
      ? 'bg-white/15 text-white shadow-md transform translate-x-1' 
      : 'hover:bg-white/10 hover:text-white hover:transform hover:translate-x-1';
    
    return `${baseClasses} ${activeClasses}`;
  };

  // Manejar toggle del sidebar con animación suave
  const handleToggle = () => {
    onToggleCollapse();
    // Cerrar submenús al colapsar con delay para mejor UX
    if (!isCollapsed) {
      setTimeout(() => {
        setIsAsignacionesOpen(false);
        setIsInventarioOpen(false);
      }, 150);
    }
  };

  // Manejar clicks en submenús cuando está colapsado
  const handleSubMenuClick = (setter, currentState, redirectPath) => {
    if (isCollapsed) {
      // Si está colapsado, redirigir al enlace principal
      window.location.href = redirectPath;
    } else {
      // Si está expandido, toggle del submenú
      setter(!currentState);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header del sidebar */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold whitespace-nowrap text-white transition-opacity duration-300">
            Inventario CTGI
          </h1>
        )}
        <button 
          onClick={handleToggle}
          className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
          title={isCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          <FaBars className="text-white transition-transform duration-300" />
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-3 space-y-2">
        {/* Inicio */}
        <div className="relative">
          <Link 
            to="/dashboard/inicio" 
            className={linkClasses("/dashboard/inicio")}
            title="Inicio"
          >
            <FaHome className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'text-lg mx-auto' : 'mr-3'}`} />
            {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">Inicio</span>}
            {/* Indicador activo para sidebar colapsado */}
            {isCollapsed && isActiveLink("/dashboard/inicio") && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-all duration-300"></div>
            )}
          </Link>
        </div>

        {/* Usuarios */}
        {user && (
          <div className="relative">
            <Link 
              to="/dashboard/usuarios" 
              className={linkClasses("/dashboard/usuarios")}
              title="Usuarios"
            >
              <FaUsers className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'text-lg mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">Usuarios</span>}
              {/* Indicador activo para sidebar colapsado */}
              {isCollapsed && isActiveLink("/dashboard/usuarios") && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-all duration-300"></div>
              )}
            </Link>
          </div>
        )}

        {/* Asignaciones */}
        <div className="relative">
          <button
            onClick={() => handleSubMenuClick(setIsAsignacionesOpen, isAsignacionesOpen, "/dashboard/asignaciones")}
            className={`${linkClasses("", ["/dashboard/asignaciones", "/dashboard/reservas"])} w-full ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title={isCollapsed ? "Ir a Asignaciones" : "Asignaciones"}
          >
            <div className="flex items-center">
              <FaEdit className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'text-lg' : 'mr-3'}`} />
              {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">Asignaciones</span>}
            </div>
            {!isCollapsed && (
              <IoIosArrowDown
                className={`transition-transform duration-300 ease-in-out ${isAsignacionesOpen ? "rotate-180" : ""}`}
              />
            )}
            {/* Indicador activo para sidebar colapsado */}
            {isCollapsed && isSectionActive(["/dashboard/asignaciones", "/dashboard/reservas"]) && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-all duration-300"></div>
            )}
          </button>
          
          {/* Submenú con animación suave */}
          <div className={`ml-6 mt-1 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
            !isCollapsed && isAsignacionesOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <Link
              to="/dashboard/asignaciones"
              className={subLinkClasses("/dashboard/asignaciones")}
            >
              <span className="whitespace-nowrap">Asignaciones</span>
            </Link>
            <Link
              to="/dashboard/reservas"
              className={subLinkClasses("/dashboard/reservas")}
            >
              <span className="whitespace-nowrap">Reservas</span>
            </Link>
          </div>
        </div>

        {/* Inventario */}
        <div className="relative">
          <button
            onClick={() => handleSubMenuClick(setIsInventarioOpen, isInventarioOpen, "/dashboard/equipos-tecnologicos")}
            className={`${linkClasses("", ["/dashboard/equipos-tecnologicos", "/dashboard/productos-consumibles"])} w-full ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            title={isCollapsed ? "Ir a Inventario" : "Inventario"}
          >
            <div className="flex items-center">
              <FaBoxes className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'text-lg' : 'mr-3'}`} />
              {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">Inventario</span>}
            </div>
            {!isCollapsed && (
              <IoIosArrowDown
                className={`transition-transform duration-300 ease-in-out ${isInventarioOpen ? "rotate-180" : ""}`}
              />
            )}
            {/* Indicador activo para sidebar colapsado */}
            {isCollapsed && isSectionActive(["/dashboard/equipos-tecnologicos", "/dashboard/productos-consumibles"]) && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-all duration-300"></div>
            )}
          </button>
          
          {/* Submenú con animación suave */}
          <div className={`ml-6 mt-1 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
            !isCollapsed && isInventarioOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <Link
              to="/dashboard/equipos-tecnologicos"
              className={subLinkClasses("/dashboard/equipos-tecnologicos")}
            >
              <span className="whitespace-nowrap">Equipos Tecnológicos</span>
            </Link>
            <Link
              to="/dashboard/productos-consumibles"
              className={subLinkClasses("/dashboard/productos-consumibles")}
            >
              <span className="whitespace-nowrap">Productos Consumibles</span>
            </Link>
          </div>
        </div>

        {/* Roles */}
        {canSeeRoles && (
          <div className="relative">
            <Link 
              to="/dashboard/roles" 
              className={linkClasses("/dashboard/roles")}
              title="Roles"
            >
              <FaChartLine className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'text-lg mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">Roles</span>}
              {/* Indicador activo para sidebar colapsado */}
              {isCollapsed && isActiveLink("/dashboard/roles") && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-all duration-300"></div>
              )}
            </Link>
          </div>
        )}

        {/* Usuarios Software */}
        {canSeeUsuariosSoftware && (
          <div className="relative">
            <Link 
              to="/dashboard/usuarios-software" 
              className={linkClasses("/dashboard/usuarios-software")}
              title="Usuarios Software"
            >
              <FaUsers className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'text-lg mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">Usuarios Software</span>}
              {/* Indicador activo para sidebar colapsado */}
              {isCollapsed && isActiveLink("/dashboard/usuarios-software") && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-all duration-300"></div>
              )}
            </Link>
          </div>
        )}

        {/* Ambientes */}
        {canSeeAmbientes && (
          <div className="relative">
            <Link 
              to="/dashboard/ambientes" 
              className={linkClasses("/dashboard/ambientes")}
              title="Ambientes"
            >
              <FaDoorOpen className={`flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'text-lg mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">Ambientes</span>}
              {/* Indicador activo para sidebar colapsado */}
              {isCollapsed && isActiveLink("/dashboard/ambientes") && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-all duration-300"></div>
              )}
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;