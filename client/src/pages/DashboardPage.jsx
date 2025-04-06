import React from "react";
import DashboardLayout from "../components/DashboardLayout";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-2 gap-6">
        {/* Tarjeta: Total Usuarios */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
          <i className="fas fa-user text-4xl text-green-600"></i>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Usuarios</h3>
            <p className="text-2xl font-bold text-gray-800">10</p>
          </div>
        </div>

        {/* Tarjeta: Categorías */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
          <i className="fas fa-th-large text-4xl text-green-600"></i>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Categorías</h3>
            <p className="text-2xl font-bold text-gray-800">2</p>
          </div>
        </div>

        {/* Tarjeta: Total Asignaciones */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
          <i className="fas fa-edit text-4xl text-green-600"></i>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Asignaciones</h3>
            <p className="text-2xl font-bold text-gray-800">25</p>
          </div>
        </div>

        {/* Tarjeta: Inventario */}
        <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
          <i className="fas fa-clipboard-list text-4xl text-green-600"></i>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Inventario</h3>
            <p className="text-2xl font-bold text-gray-800">5</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;