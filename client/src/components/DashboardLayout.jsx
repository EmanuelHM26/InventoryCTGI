import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Header from "./Header";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navbar con ancho fijo */}
      <aside className="w-64 bg-green-700 h-screen fixed">
        <Navbar />
      </aside>

      {/* Contenedor principal con margen izquierdo */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header siempre visible */}
        <Header />
        {/* Contenido principal */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;