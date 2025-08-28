import React from "react";
import BarcodeReader from './BarcodeReader';
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { useEquiposTecnologicos } from "../hooks/useEquiposTecnologicos";

const EquiposTecnologicos = () => {
  const {
    equipos,
    showModal,
    handleCloseModal,
    handleSubmit,
    onSubmit,
    register,
    errors,
    handleEditEquipo,
    handleDeleteEquipo,
    handleNewEquipo,
    searchTerm,
    setSearchTerm,
    requestSort,
    sortConfig,
    currentPage,
    totalPages,
    paginate,
    isScanning,
    setIsScanning,
    handleBarcodeScanned,
    indexOfFirstItem,
    indexOfLastItem,
    sortedEquipos,
    watch,
  } = useEquiposTecnologicos();

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Equipos Tecnológicos
          </h1>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar equipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              onClick={handleNewEquipo}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Nuevo Equipo
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",
                  "Código",
                  "Nombre",
                  "Marca",
                  "Modelo",
                  "Acciones",
                ].map((header, index) => (
                  <th
                    key={index}
                    onClick={() => {
                      if (index < 5) {
                        const keys = [
                          "IdEquiposTecnologicos",
                          "Codigo",
                          "Nombre",
                          "Marca",
                          "Modelo",
                        ];
                        requestSort(keys[index]);
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${index < 5 ? "cursor-pointer hover:bg-gray-100" : ""
                      }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipos.length > 0 ? (
                equipos.map((equipo) => (
                  <tr
                    key={equipo.IdEquiposTecnologicos}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">{equipo.IdEquiposTecnologicos}</td>
                    <td className="px-4 py-3">{equipo.Codigo}</td>
                    <td className="px-4 py-3">{equipo.Nombre}</td>
                    <td className="px-4 py-3">{equipo.Marca}</td>
                    <td className="px-4 py-3">{equipo.Modelo}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEquipo(equipo)}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                          title="Editar equipo"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteEquipo(equipo.IdEquiposTecnologicos)
                          }
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                          title="Eliminar equipo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron equipos tecnológicos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {sortedEquipos.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, sortedEquipos.length)} de{" "}
              {sortedEquipos.length} equipos
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => paginate(idx + 1)}
                  className={`w-10 h-10 rounded-md ${currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear o editar un equipo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {watch('IdEquiposTecnologicos') ? "Editar Equipo" : "Crear Nuevo Equipo"}
            </h2>

            {/* Modo de Escaner */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modo de Escaneado
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsScanning(!isScanning)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isScanning
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {isScanning ? 'Detener Escáner' : 'Iniciar Escáner'}
                </button>
                <div className="text-sm text-gray-500 self-center">
                  {isScanning ? 'Escaneando... Apunte la cámara al código' : 'Presione para activar el escáner'}
                </div>
              </div>
            </div>

            {/* Componente BarcodeReader dentro del modal */}
            {isScanning && (
              <div className="mb-4 p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
                <div className="text-center mb-2">
                  <p className="text-sm text-blue-700 font-medium">Escáner Activo</p>
                  <p className="text-xs text-blue-600">Apunte la cámara hacia el código de barras</p>
                </div>
                <BarcodeReader
                  onScan={handleBarcodeScanned}
                  isActive={isScanning}
                />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código *
                  </label>
                  <input
                    type="text"
                    {...register("Codigo", {
                      required: "El código es obligatorio",
                      minLength: {
                        value: 1,
                        message: "El código debe tener al menos 1 carácter"
                      }
                    })}
                    className={`border p-2 rounded-lg w-full ${errors.Codigo ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Ingrese el código o use el escáner"
                  />
                  {errors.Codigo && (
                    <p className="text-red-500 text-xs mt-1">{errors.Codigo.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    {...register("Nombre", {
                      required: "El nombre es obligatorio",
                      minLength: {
                        value: 2,
                        message: "El nombre debe tener al menos 2 caracteres"
                      }
                    })}
                    className={`border p-2 rounded-lg w-full ${errors.Nombre ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.Nombre && (
                    <p className="text-red-500 text-xs mt-1">{errors.Nombre.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marca *
                  </label>
                  <input
                    type="text"
                    {...register("Marca", {
                      required: "La marca es obligatoria",
                      minLength: {
                        value: 2,
                        message: "La marca debe tener al menos 2 caracteres"
                      }
                    })}
                    className={`border p-2 rounded-lg w-full ${errors.Marca ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.Marca && (
                    <p className="text-red-500 text-xs mt-1">{errors.Marca.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    {...register("Modelo", {
                      required: "El modelo es obligatorio",
                      minLength: {
                        value: 1,
                        message: "El modelo debe tener al menos 1 carácter"
                      }
                    })}
                    className={`border p-2 rounded-lg w-full ${errors.Modelo ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.Modelo && (
                    <p className="text-red-500 text-xs mt-1">{errors.Modelo.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {watch('IdEquiposTecnologicos') ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquiposTecnologicos;