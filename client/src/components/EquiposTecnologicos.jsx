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
  Loader
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
    loading
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
                placeholder="Buscar por código, nombre, marca, estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
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
              disabled={loading}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader size={18} className="mr-2 animate-spin" />
              ) : (
                <Plus size={18} className="mr-2" />
              )}
              {loading ? "Cargando..." : "Nuevo Equipo"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader size={32} className="animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando equipos...</span>
          </div>
        )}

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
                  "Estado",
                  "Acciones",
                ].map((header, index) => (
                  <th
                    key={index}
                    onClick={() => {
                      if (index < 6) {
                        const keys = [
                          "idequipostecnologicos",
                          "Codigo",
                          "Nombre",
                          "Marca",
                          "Modelo",
                          "Estado",
                        ];
                        requestSort(keys[index]);
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${index < 6 ? "cursor-pointer hover:bg-gray-100" : ""
                      }`}
                  >
                    <div className="flex items-center">
                      {header}
                      {index < 6 && sortConfig.key === [
                        "idequipostecnologicos",
                        "Codigo",
                        "Nombre",
                        "Marca",
                        "Modelo",
                        "Estado",
                      ][index] && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipos.length > 0 ? (
                equipos.map((equipo) => (
                  <tr
                    key={equipo.idequipostecnologicos}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {equipo.idequipostecnologicos}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                      {equipo.Codigo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {equipo.Nombre}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {equipo.Marca}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {equipo.Modelo}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${equipo.Estado === "Activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}>
                        {equipo.Estado || "Sin estado"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEquipo(equipo)}
                          disabled={loading}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                          title="Editar equipo"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteEquipo(equipo.idequipostecnologicos)}
                          disabled={loading}
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {loading ? "Cargando..." : "No se encontraron equipos tecnológicos"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {/* Paginación */}
        {sortedEquipos.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, sortedEquipos.length)} de{" "}
              {sortedEquipos.length} equipos
              {/* ✅ CORREGIDO: filteredEquipos.length muestra el total filtrado */}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className={`p-2 rounded-md ${currentPage === 1 || loading
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
                  disabled={loading}
                  className={`w-10 h-10 rounded-md ${currentPage === idx + 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className={`p-2 rounded-md ${currentPage === totalPages || loading
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
              {watch('idequipostecnologicos') ? "Editar Equipo" : "Crear Nuevo Equipo"}
            </h2>

            {/* Modo de Escáner */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Escáner de Código de Barras
              </label>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => setIsScanning(!isScanning)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isScanning
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {isScanning ? 'Detener Escáner' : 'Iniciar Escáner'}
                </button>
                <div className="text-sm text-blue-600">
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
                      },
                      validate: {
                        notEmpty: value => value.trim() !== "" || "El código no puede estar vacío"
                      }
                    })}
                    className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Codigo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    placeholder="Ingrese el código o use el escáner"
                    disabled={loading}
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
                      },
                      validate: {
                        notEmpty: value => value.trim() !== "" || "El nombre no puede estar vacío"
                      }
                    })}
                    className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    disabled={loading}
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
                      },
                      validate: {
                        notEmpty: value => value.trim() !== "" || "La marca no puede estar vacía"
                      }
                    })}
                    className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Marca ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    disabled={loading}
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
                      },
                      validate: {
                        notEmpty: value => value.trim() !== "" || "El modelo no puede estar vacío"
                      }
                    })}
                    className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Modelo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    disabled={loading}
                  />
                  {errors.Modelo && (
                    <p className="text-red-500 text-xs mt-1">{errors.Modelo.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    {...register("Estado")}
                    className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    disabled={loading}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Dañado">Dañado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    watch('idequipostecnologicos') ? "Actualizar" : "Crear"
                  )}
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