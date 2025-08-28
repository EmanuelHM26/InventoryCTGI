import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const ProtectedLayout = () => {
  return (
    <div className="flex">
      {/* Navbar siempre visible en rutas protegidas */}
      <Navbar />
      {/* Contenido dinámico al lado derecho */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;