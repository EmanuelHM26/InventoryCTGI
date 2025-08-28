import React from "react";
import { useAsignaciones } from "../hooks/useAsignaciones";
import BarcodeReader from "./BarcodeReader";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
  Eye,
} from "lucide-react";

const Asignaciones = () => {
  const {
    asignaciones,
    usuarios,
    showModal,
    showNovedadModal,
    selectedNovedad,
    showDetailsModal,
    selectedAsignacion,
    formTouched,
    newAsignacion,
    currentPage,
    searchTerm,
    barcodeMode,
    scannedEquipment,
    showBarcodeInstructions,
    currentAsignaciones,
    sortedAsignaciones,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    setSearchTerm,
    setShowModal,
    setShowNovedadModal,
    setSelectedNovedad,
    setShowDetailsModal,
    setFormTouched,
    setNewAsignacion,
    setBarcodeMode,
    setScannedEquipment,
    setShowBarcodeInstructions,
    handleBarcodeScan,
    handleUsuarioChange,
    handleCreateAsignacion,
    handleEditAsignacion,
    handleDeleteAsignacion,
    handleConfirmarDevolucion,
    handleShowNovedad,
    handleShowDetails,
    paginate,
    exportToPDF,
    exportToExcel,
    getTodayLocal,
    formatDate,
    handleRemoveScannedEquipment,
  } = useAsignaciones();

  return (
    <div className="px-4 py-20 md:px-8 lg:px-2 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Asignaciones
          </h1>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar asignación..."
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
            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                title="Exportar a PDF"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M12 16v-8m0 8l-3-3m3 3l3-3M4 4h16v16H4V4z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                title="Exportar a Excel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M4 4h16v16H4V4zm8 4v8m0 0l-3-3m3 3l3-3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Excel
              </button>
            </div>
            <button
              onClick={() => {
                setNewAsignacion({
                  IdUsuario: "",
                  Usuario: "",
                  Nombre: "",
                  Apellido: "",
                  Documento: "",
                  FechaAsignacion: getTodayLocal(),
                  HoraAsignacion: "",
                  Observacion: "",
                  FechaDevolucion: "",
                  HoraDevolucion: "",
                  Novedad: "",
                  Cantidad: "",
                  Item: "",
                  Estado: "Activo",
                });
                setScannedEquipment([]); // Limpiar equipos escaneados
                setBarcodeMode("user"); // Iniciar en modo usuario
                setShowModal(true);
                setShowBarcodeInstructions(true);
                setTimeout(() => setShowBarcodeInstructions(false), 5000);
              }}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Nueva Asignación
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "ID",
                  "Usuario",
                  "Nombre",
                  "Apellido",
                  "Documento",
                  "Fecha Asignación",
                  "Hora Asignación",
                  "Observación",
                  "Acciones",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentAsignaciones.length > 0 ? (
                currentAsignaciones.map((asignacion) => (
                  <tr
                    key={asignacion.IdAsignaciones}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.IdAsignaciones}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Usuario?.Usuario || "N/A"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Nombre}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Apellido}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Documento}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(asignacion.FechaAsignacion)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(asignacion.FechaDevolucion)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Observacion}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleShowDetails(asignacion)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200"
                          title="Ver detalles completos"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditAsignacion(asignacion)}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                          title="Editar asignación"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteAsignacion(asignacion.IdAsignaciones)
                          }
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                          title="Eliminar asignación"
                        >
                          <Trash2 size={16} />
                        </button>
                        {asignacion.Estado === "Activo" && (
                          <button
                            onClick={() =>
                              handleConfirmarDevolucion(
                                asignacion.IdAsignaciones
                              )
                            }
                            className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors duration-200"
                            title="Confirmar devolución"
                          >
                            <Check size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron asignaciones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {sortedAsignaciones.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, sortedAsignaciones.length)} de{" "}
              {sortedAsignaciones.length} asignaciones
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
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
                  className={`w-10 h-10 rounded-md ${
                    currentPage === idx + 1
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
                className={`p-2 rounded-md ${
                  currentPage === totalPages
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

      {/* Modal para crear o editar una asignación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {newAsignacion.IdAsignaciones
                ? "Editar Asignación"
                : "Crear Nueva Asignación"}
            </h2>

            {/* Controles de modo de código de barras */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Modo de Escaneo
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBarcodeMode("user")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        barcodeMode === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      Escanear Usuario
                    </button>
                    <button
                      type="button"
                      onClick={() => setBarcodeMode("equipment")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        barcodeMode === "equipment"
                          ? "bg-green-600 text-white"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      Escanear Equipos
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">
                    Modo actual:
                    <span
                      className={`ml-1 ${
                        barcodeMode === "user"
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {barcodeMode === "user"
                        ? "Escaneando Usuario"
                        : "Escaneando Equipos"}
                    </span>
                  </p>
                  {showBarcodeInstructions && (
                    <p className="text-xs mt-1 text-blue-600 animate-pulse">
                      {barcodeMode === "user"
                        ? "Escanee el documento del usuario..."
                        : "Escanee los códigos de los equipos..."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <select
                  value={newAsignacion.IdUsuario}
                  onChange={handleUsuarioChange}
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !newAsignacion.IdUsuario
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Seleccione un usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.IdUsuario} value={usuario.IdUsuario}>
                      {usuario.Nombre} {usuario.Apellido}
                    </option>
                  ))}
                </select>
                {!newAsignacion.IdUsuario && formTouched && (
                  <p className="text-red-500 text-xs mt-1">
                    Este campo es obligatorio
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAsignacion.Nombre}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      Nombre: e.target.value,
                    })
                  }
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !newAsignacion.Nombre
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  disabled
                  required
                />
                {!newAsignacion.Nombre && formTouched && (
                  <p className="text-red-500 text-xs mt-1">
                    Este campo es obligatorio
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAsignacion.Apellido}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      Apellido: e.target.value,
                    })
                  }
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !newAsignacion.Apellido
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  disabled
                  required
                />
                {!newAsignacion.Apellido && formTouched && (
                  <p className="text-red-500 text-xs mt-1">
                    Este campo es obligatorio
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAsignacion.Documento}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      Documento: e.target.value,
                    })
                  }
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !newAsignacion.Documento
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  disabled
                  required
                />
                {!newAsignacion.Documento && formTouched && (
                  <p className="text-red-500 text-xs mt-1">
                    Este campo es obligatorio
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observación
                </label>
                <input
                  type="text"
                  value={newAsignacion.Observacion}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      Observacion: e.target.value,
                    })
                  }
                  className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                  placeholder="Ingrese una observación"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newAsignacion.Cantidad}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      Cantidad: e.target.value,
                    })
                  }
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !newAsignacion.Cantidad || newAsignacion.Cantidad <= 0
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  min="1"
                  max="9999"
                  placeholder="Ingrese la cantidad"
                  required
                />
                {(!newAsignacion.Cantidad || newAsignacion.Cantidad <= 0) &&
                  formTouched && (
                    <p className="text-red-500 text-xs mt-1">
                      Debe ingresar una cantidad válida (mayor a 0)
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item <span className="text-red-500">*</span>
                </label>
                <select
                  value={newAsignacion.Item}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      Item: e.target.value,
                    })
                  }
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    !newAsignacion.Item
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Seleccione un item</option>
                  <option value="Equipo Tecnologico">Equipo Tecnológico</option>
                  <option value="Producto Consumible">
                    Producto Consumible
                  </option>
                </select>
                {!newAsignacion.Item && formTouched && (
                  <p className="text-red-500 text-xs mt-1">
                    Este campo es obligatorio
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={newAsignacion.Estado}
                onChange={(e) =>
                  setNewAsignacion({
                    ...newAsignacion,
                    Estado: e.target.value,
                  })
                }
                className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !newAsignacion.Estado
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">Seleccione un estado</option>
                <option value="Activo">Activo</option>
              </select>
              {!newAsignacion.Estado && formTouched && (
                <p className="text-red-500 text-xs mt-1">
                  Este campo es obligatorio
                </p>
              )}
            </div>

            
            {/* Mostrar equipos escaneados */}
            {scannedEquipment.length > 0 && (
              <div className="mb-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  Equipos Escaneados
                </h4>
                <div className="space-y-2">
                  {scannedEquipment.map((equipment, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-md font-medium">
                          {equipment.code}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveScannedEquipment(equipment.code)
                        }
                        className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200 hover:scale-110 transform"
                        title="Eliminar equipo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-800 font-semibold">
                        Total de equipos:
                      </span>
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                        {scannedEquipment.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setFormTouched(true);
                  handleCreateAsignacion();
                }}
                disabled={
                  !newAsignacion.IdUsuario ||
                  !newAsignacion.Nombre ||
                  !newAsignacion.Apellido ||
                  !newAsignacion.Documento ||
                  !newAsignacion.Cantidad ||
                  newAsignacion.Cantidad <= 0 ||
                  !newAsignacion.Item ||
                  !newAsignacion.Estado
                }
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  !newAsignacion.IdUsuario ||
                  !newAsignacion.Nombre ||
                  !newAsignacion.Apellido ||
                  !newAsignacion.Documento ||
                  !newAsignacion.Cantidad ||
                  newAsignacion.Cantidad <= 0 ||
                  !newAsignacion.Item ||
                  !newAsignacion.Estado
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {newAsignacion.IdAsignaciones ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar novedad completa */}
      {showNovedadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Novedad Completa
              </h3>
              <button
                onClick={() => setShowNovedadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-700 whitespace-pre-wrap break-words">
                  {selectedNovedad}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowNovedadModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar detalles completos */}
      {showDetailsModal && selectedAsignacion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-5xl mx-4 max-h-screen overflow-hidden">
            {/* Header con gradiente gris elegante */}
            <div className="bg-green-800 px-8 py-6 text-white relative overflow-hidden rounded-t-2xl">
              <div className="relative flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    Detalles de Asignación
                  </h3>
                  <p className="text-slate-300 text-sm">
                    ID: #{selectedAsignacion.IdAsignaciones}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Contenido scrolleable */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-8 bg-gray-50">
              {/* Información del usuario - Tarjeta destacada */}
              <div className="bg-gray-100 rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  Información del Usuario
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Usuario
                    </label>
                    <p className="text-gray-900 font-bold text-xl">
                      {selectedAsignacion.Usuario?.Usuario || "N/A"}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Nombre Completo
                    </label>
                    <p className="text-gray-900 font-bold text-xl">
                      {selectedAsignacion.Nombre} {selectedAsignacion.Apellido}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Documento
                    </label>
                    <p className="text-gray-900 font-bold text-xl">
                      {selectedAsignacion.Documento}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fechas y horarios */}
              <div className="bg-gray-100 rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  Fechas y Horarios
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Fecha de Asignación
                    </label>
                    <p className="text-gray-900 font-bold text-lg">
                      {formatDate(selectedAsignacion.FechaAsignacion)}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Hora de Asignación
                    </label>
                    <p className="text-gray-900 font-bold text-lg">
                      {selectedAsignacion.HoraAsignacion || "N/A"}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Fecha de Devolución
                    </label>
                    <p
                      className={`font-bold text-lg ${
                        selectedAsignacion.FechaDevolucion
                          ? "text-gray-900"
                          : "text-gray-400 italic"
                      }`}
                    >
                      {formatDate(selectedAsignacion.FechaDevolucion) ||
                        "No devuelto"}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Hora de Devolución
                    </label>
                    <p
                      className={`font-bold text-lg ${
                        selectedAsignacion.HoraDevolucion
                          ? "text-gray-900"
                          : "text-gray-400 italic"
                      }`}
                    >
                      {selectedAsignacion.HoraDevolucion || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detalles del item */}
              <div className="bg-gray-100 rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  Detalles del Item
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Item
                    </label>
                    <p className="text-gray-900 font-bold text-xl">
                      {selectedAsignacion.Item}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Cantidad
                    </label>
                    <div className="flex items-center">
                      <div className="bg-green-100 text-green-800 px-4 py-3 rounded-full font-bold text-2xl shadow-md">
                        {selectedAsignacion.Cantidad}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Estado
                    </label>
                    <span
                      className={
                        selectedAsignacion.Estado === "Activo"
                          ? "bg-green-100 text-green-800 px-4 py-3 rounded-full font-bold text-sm inline-flex items-center shadow-md border border-green-200"
                          : "bg-red-100 text-red-800 px-4 py-3 rounded-full font-bold text-sm inline-flex items-center shadow-md border border-red-200"
                      }
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          selectedAsignacion.Estado === "Activo"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      {selectedAsignacion.Estado}
                    </span>
                  </div>
                </div>
              </div>

              {/* Observación */}
              <div className="bg-gray-100 rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  Observación
                </h4>
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words text-base">
                    {selectedAsignacion.Observacion}
                  </p>
                </div>
              </div>

              {/* Novedad (solo si existe) */}
              {selectedAsignacion.Novedad && (
                <div className="bg-gray-100 rounded-xl p-6 shadow-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    Novedad Reportada
                  </h4>
                  <div className="bg-white p-6 rounded-xl shadow-md border border-red-100">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words text-base">
                      {selectedAsignacion.Novedad}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer con gradiente gris elegante (igual que el header) */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-8 py-4 border-t border-gray-300">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Componente lector de códigos de barras */}
      <BarcodeReader
        onScan={handleBarcodeScan}
        isActive={showModal} // Solo activo cuando el modal está abierto
      />
    </div>
  );
};

export default Asignaciones;
