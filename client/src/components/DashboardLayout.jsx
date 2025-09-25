import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Header from "./Header";

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Navbar con ancho variable */}
      <aside className={`bg-green-700 h-screen fixed transition-all duration-300 z-30 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <Navbar 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isCollapsed={isSidebarCollapsed}
        />
      </aside>

      {/* Header con posición dinámica */}
      <Header isSidebarCollapsed={isSidebarCollapsed} />

      {/* Contenedor principal con margen izquierdo variable */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Espacio para el header fijo */}
        <div className="h-16"></div>
        
        {/* Contenido principal */}
        <main className="p-4 flex-grow overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;