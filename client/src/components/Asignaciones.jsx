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
  FileText,
  AlertCircle,
} from "lucide-react";

const Asignaciones = () => {
  const {
    usuarios,
    showModal,
    showNovedadModal,
    selectedNovedad,
    showAmbientesPanel,
    ambienteSearchTerm,
    filteredAmbientes,
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
    showEquipmentsModal,
    selectedEquipments,
    showObservacionesModal,
    showNovedadesDevolucionModal,
    equiposConDetalles,
    // 👇 NUEVOS HOOKS PARA CONSUMIBLES
    productosConsumibles,
    showConsumiblesPanel,
    consumibleSearchTerm,
    selectedConsumibles,
    filteredConsumibles,
    showObservacionesConsumiblesModal,
    showNovedadesConsumiblesModal,
    consumiblesConDetalles,
    setShowEquipmentsModal,
    handleShowEquipments,
    setSearchTerm,
    setShowModal,
    setShowNovedadModal,
    setShowDetailsModal,
    setFormTouched,
    setNewAsignacion,
    setBarcodeMode,
    setScannedEquipment,
    setShowBarcodeInstructions,
    setShowAmbientesPanel,
    setAmbienteSearchTerm,
    handleSelectAmbiente,
    handleBarcodeScan,
    handleUsuarioChange,
    handleCreateAsignacion,
    handleEditAsignacion,
    handleDeleteAsignacion,
    handleConfirmarDevolucion,
    handleShowDetails,
    paginate,
    handleRemoveScannedEquipment,
    exportToPDF,
    exportToExcel,
    getTodayLocal,
    formatDate,
    setShowObservacionesModal,
    handleOpenObservacionesModal,
    handleUpdateObservacionEquipo,
    setShowNovedadesDevolucionModal,
    handleUpdateNovedadEquipo,
    handleProcesarDevolucion,
    // 👇 NUEVAS FUNCIONES PARA CONSUMIBLES
    setShowConsumiblesPanel,
    setConsumibleSearchTerm,
    setSelectedConsumibles,
    handleSelectConsumible,
    handleRemoveConsumible,
    setShowObservacionesConsumiblesModal,
    handleOpenObservacionesConsumiblesModal,
    handleUpdateObservacionConsumible,
    setShowNovedadesConsumiblesModal,
    handleUpdateNovedadConsumible,
    handleProcesarDevolucionConsumibles,
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
                  Nombre: "",
                  Apellido: "",
                  Documento: "",
                  FechaAsignacion: getTodayLocal(),
                  HoraAsignacion: "",
                  Observacion: "",
                  Ambiente: "",
                  CodigoAmbiente: "",
                  FechaDevolucion: null,
                  HoraDevolucion: null,
                  Novedad: "",
                  Cantidad: "",
                  Item: "",
                  Estado: "Activo",
                });
                setScannedEquipment([]);
                setSelectedConsumibles([]); // 👈 NUEVO: Limpiar consumibles
                setBarcodeMode("user");
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
                      {formatDate(asignacion.HoraAsignacion)}
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

            {/* 👇 NUEVO: Selector de Item PRIMERO */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Item <span className="text-red-500">*</span>
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
                <option value="">Seleccione un tipo de item</option>
                <option value="Equipo Tecnologico">Equipo Tecnológico</option>
                <option value="Producto Consumible">Producto Consumible</option>
              </select>
              {!newAsignacion.Item && formTouched && (
                <p className="text-red-500 text-xs mt-1">
                  Este campo es obligatorio
                </p>
              )}
            </div>

            {/* 👇 CONDICIONAL: Controles de código de barras - SOLO PARA EQUIPOS */}
            {newAsignacion.Item === "Equipo Tecnologico" && (
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
            )}

            {/* Campos de usuario (sin cambios) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Listado Nombres <span className="text-red-500">*</span>
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
                  disabled
                  required
                />
                {(!newAsignacion.Cantidad || newAsignacion.Cantidad <= 0) &&
                  formTouched && (
                    <p className="text-red-500 text-xs mt-1">
                      Debe ingresar una cantidad válida (mayor a 0)
                    </p>
                  )}
              </div>

              {/* 👇 CONDICIONAL: Campo Ambiente - OBLIGATORIO SOLO PARA EQUIPOS */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ambiente{" "}
                  {newAsignacion.Item === "Equipo Tecnologico" && (
                    <span className="text-red-500">*</span>
                  )}
                  {newAsignacion.Item === "Producto Consumible" && (
                    <span className="text-gray-500 text-xs">(Opcional)</span>
                  )}
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Input de ambiente */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={
                        newAsignacion.Ambiente
                          ? `${newAsignacion.Ambiente} (Código: ${newAsignacion.CodigoAmbiente})`
                          : ""
                      }
                      readOnly
                      className={`border p-3 rounded-lg w-full bg-gray-50 text-gray-700 focus:outline-none h-full ${
                        !newAsignacion.Ambiente &&
                        newAsignacion.Item === "Equipo Tecnologico"
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="No se ha seleccionado un ambiente"
                    />
                  </div>

                  {/* Botón de selección */}
                  <button
                    type="button"
                    onClick={() => setShowAmbientesPanel(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 whitespace-nowrap flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Seleccionar Ambiente
                  </button>
                </div>

                {/* Mensaje de error solo si es obligatorio y no está seleccionado */}
                {!newAsignacion.Ambiente &&
                  newAsignacion.Item === "Equipo Tecnologico" &&
                  formTouched && (
                    <p className="text-red-500 text-xs mt-1">
                      Este campo es obligatorio para equipos tecnológicos
                    </p>
                  )}

                {/* Información adicional del ambiente seleccionado */}
                {newAsignacion.Ambiente && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-green-700 font-medium">
                        Ambiente seleccionado:{" "}
                        <strong>{newAsignacion.Ambiente}</strong>
                        {newAsignacion.CodigoAmbiente && (
                          <span className="ml-2 text-green-600">
                            (Código: {newAsignacion.CodigoAmbiente})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campo Estado */}
            <div className="mb-4">
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

            {/* 👇 CONDICIONAL: Mostrar equipos escaneados - SOLO PARA EQUIPOS */}
            {newAsignacion.Item === "Equipo Tecnologico" &&
              scannedEquipment.length > 0 && (
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

            {/* 👇 NUEVO: Mostrar productos consumibles seleccionados */}
            {newAsignacion.Item === "Producto Consumible" &&
              selectedConsumibles.length > 0 && (
                <div className="mb-4 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Productos Consumibles Seleccionados
                  </h4>
                  <div className="space-y-2">
                    {selectedConsumibles.map((consumible, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-800">
                              {consumible.Nombre}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                              {consumible.CantidadAsignada}{" "}
                              {consumible.UnidadMedida} de{" "}
                              {consumible.ValorMedida}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Disponible: {consumible.CantidadDisponible} unidades
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveConsumible(
                              consumible.IdProductoConsumible
                            )
                          }
                          className="ml-3 p-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200 hover:scale-110 transform"
                          title="Eliminar producto"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-800 font-semibold">
                          Total de productos:
                        </span>
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                          {selectedConsumibles.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* 👇 NUEVO: Botón para seleccionar productos consumibles */}
            {newAsignacion.Item === "Producto Consumible" && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowConsumiblesPanel(true)}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                >
                  <Plus size={20} />
                  Seleccionar Productos Consumibles
                </button>
              </div>
            )}

            {/* 👇 CONDICIONAL: Botón para revisar observaciones de EQUIPOS */}
            {newAsignacion.Item === "Equipo Tecnologico" &&
              scannedEquipment.length > 0 &&
              !newAsignacion.IdAsignaciones && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleOpenObservacionesModal}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                  >
                    <FileText size={20} />
                    Revisar y Agregar Observaciones a Equipos
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Opcional: Agregue observaciones específicas a cada equipo
                    antes de crear la asignación
                  </p>
                </div>
              )}

            {/* 👇 NUEVO: Botón para revisar observaciones de CONSUMIBLES */}
            {newAsignacion.Item === "Producto Consumible" &&
              selectedConsumibles.length > 0 &&
              !newAsignacion.IdAsignaciones && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleOpenObservacionesConsumiblesModal}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                  >
                    <FileText size={20} />
                    Revisar y Agregar Observaciones a Productos
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Opcional: Agregue observaciones específicas a cada producto
                    antes de crear la asignación
                  </p>
                </div>
              )}

            {/* Botones del modal con validación condicional */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowModal(false);
                  setScannedEquipment([]);
                  setSelectedConsumibles([]);
                }}
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
                  !newAsignacion.Item ||
                  !newAsignacion.Estado ||
                  // 👇 VALIDACIÓN CONDICIONAL: Ambiente solo obligatorio para equipos
                  (newAsignacion.Item === "Equipo Tecnologico" &&
                    !newAsignacion.Ambiente) ||
                  // 👇 VALIDACIÓN CONDICIONAL: Al menos un equipo o consumible según el tipo
                  (newAsignacion.Item === "Equipo Tecnologico" &&
                    scannedEquipment.length === 0) ||
                  (newAsignacion.Item === "Producto Consumible" &&
                    selectedConsumibles.length === 0)
                }
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  !newAsignacion.IdUsuario ||
                  !newAsignacion.Nombre ||
                  !newAsignacion.Apellido ||
                  !newAsignacion.Documento ||
                  !newAsignacion.Item ||
                  !newAsignacion.Estado ||
                  (newAsignacion.Item === "Equipo Tecnologico" &&
                    !newAsignacion.Ambiente) ||
                  (newAsignacion.Item === "Equipo Tecnologico" &&
                    scannedEquipment.length === 0) ||
                  (newAsignacion.Item === "Producto Consumible" &&
                    selectedConsumibles.length === 0)
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
      {/* Modal para agregar observaciones a equipos ANTES de crear asignación */}
      {showObservacionesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-4xl mx-4 max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    Observaciones Iniciales de Equipos
                  </h3>
                  <p className="text-green-100 text-sm">
                    Agregue observaciones específicas para cada equipo
                    (opcional)
                  </p>
                </div>
                <button
                  onClick={() => setShowObservacionesModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8 overflow-y-auto max-h-[calc(85vh-180px)]">
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-blue-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Instrucciones:</strong> Puede agregar
                      observaciones específicas para cada equipo que se está
                      prestando. Por ejemplo: "Teclado con tecla suelta",
                      "Pantalla con pequeño rayón", etc. Estas observaciones son{" "}
                      <strong>opcionales</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {scannedEquipment.map((equipo, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <FileText size={24} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-lg text-gray-800">
                            Equipo #{index + 1}
                          </h4>
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-mono">
                            {equipo.code}
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observación Inicial (Opcional)
                          </label>
                          <textarea
                            value={equipo.observacionInicial || ""}
                            onChange={(e) =>
                              handleUpdateObservacionEquipo(
                                equipo.code,
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            placeholder="Ej: Equipo en perfecto estado, Teclado con tecla suelta, etc."
                            rows={3}
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {equipo.observacionInicial?.length || 0}/500
                            caracteres
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowObservacionesModal(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setShowObservacionesModal(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                >
                  Guardar y Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 👇 NUEVO: Modal para agregar observaciones a CONSUMIBLES ANTES de crear asignación */}
      {showObservacionesConsumiblesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-4xl mx-4 max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    Observaciones Iniciales de Productos Consumibles
                  </h3>
                  <p className="text-green-100 text-sm">
                    Agregue observaciones específicas para cada producto
                    (opcional)
                  </p>
                </div>
                <button
                  onClick={() => setShowObservacionesConsumiblesModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8 overflow-y-auto max-h-[calc(85vh-180px)]">
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-blue-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-blue-800">
                      <strong>Instrucciones:</strong> Puede agregar
                      observaciones específicas para cada producto que se está
                      entregando. Por ejemplo: "Empaques sellados", "Producto en
                      perfectas condiciones", etc. Estas observaciones son{" "}
                      <strong>opcionales</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedConsumibles.map((consumible, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <FileText size={24} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-lg text-gray-800">
                            {consumible.Nombre}
                          </h4>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {consumible.CantidadAsignada}{" "}
                            {consumible.UnidadMedida}
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observación Inicial (Opcional)
                          </label>
                          <textarea
                            value={consumible.ObservacionInicial || ""}
                            onChange={(e) =>
                              handleUpdateObservacionConsumible(
                                consumible.IdProductoConsumible,
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            placeholder="Ej: Producto en perfectas condiciones, Empaques sellados, etc."
                            rows={3}
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {consumible.ObservacionInicial?.length || 0}/500
                            caracteres
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowObservacionesConsumiblesModal(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setShowObservacionesConsumiblesModal(false)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                >
                  Guardar y Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* Modal para agregar novedades por equipo al DEVOLVER */}
      {showNovedadesDevolucionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-4xl mx-4 max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    Confirmar Devolución de Equipos
                  </h3>
                  <p className="text-green-100 text-sm">
                    Revise cada equipo y registre novedades si es necesario
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowNovedadesDevolucionModal(false);
                    setEquiposConDetalles([]);
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8 overflow-y-auto max-h-[calc(85vh-250px)]">
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-yellow-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Revise cada equipo al momento
                      de la devolución. Si detecta algún daño o novedad,
                      márquelo y describa el problema.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {equiposConDetalles.map((equipo, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                      equipo.TieneNovedad
                        ? "bg-red-50 border-red-300 shadow-md"
                        : "bg-gray-50 border-gray-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          equipo.TieneNovedad ? "bg-red-100" : "bg-green-100"
                        }`}
                      >
                        {equipo.TieneNovedad ? (
                          <AlertCircle size={24} className="text-red-600" />
                        ) : (
                          <Check size={24} className="text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-lg text-gray-800">
                            Equipo #{index + 1}
                          </h4>
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-mono">
                            {equipo.CodigoEquipo}
                          </span>
                        </div>

                        {/* Mostrar observación inicial si existe */}
                        {equipo.ObservacionInicial && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-700 mb-1">
                              OBSERVACIÓN AL PRESTAR:
                            </p>
                            <p className="text-sm text-blue-900">
                              {equipo.ObservacionInicial}
                            </p>
                          </div>
                        )}

                        {/* Checkbox para marcar si tiene novedad */}
                        <div className="mb-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={equipo.TieneNovedad}
                              onChange={(e) =>
                                handleUpdateNovedadEquipo(
                                  equipo.CodigoEquipo,
                                  e.target.checked,
                                  equipo.NovedadDevolucion
                                )
                              }
                              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            />
                            <span className="font-medium text-gray-700">
                              Este equipo presenta alguna novedad o daño
                            </span>
                          </label>
                        </div>

                        {/* Textarea para descripción de novedad (solo si está marcado) */}
                        {equipo.TieneNovedad && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Descripción de la Novedad{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={equipo.NovedadDevolucion || ""}
                              onChange={(e) =>
                                handleUpdateNovedadEquipo(
                                  equipo.CodigoEquipo,
                                  true,
                                  e.target.value
                                )
                              }
                              className="w-full border-2 border-red-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                              placeholder="Describa detalladamente el daño o novedad encontrada..."
                              rows={3}
                              maxLength={500}
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1 text-right">
                              {equipo.NovedadDevolucion?.length || 0}/500
                              caracteres
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Novedad general (opcional) */}
              <div className="mt-6 p-5 bg-gray-100 border border-gray-300 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observación General de la Devolución (Opcional)
                </label>
                <textarea
                  id="novedadGeneral"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Puede agregar comentarios generales sobre la devolución..."
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  <strong>
                    {equiposConDetalles.filter((eq) => eq.TieneNovedad).length}
                  </strong>{" "}
                  de <strong>{equiposConDetalles.length}</strong> equipos con
                  novedades
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNovedadesDevolucionModal(false);
                      setEquiposConDetalles([]);
                    }}
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // Validar que los equipos con novedad tengan descripción
                      const equiposConNovedadSinDescripcion =
                        equiposConDetalles.filter(
                          (eq) =>
                            eq.TieneNovedad && !eq.NovedadDevolucion?.trim()
                        );

                      if (equiposConNovedadSinDescripcion.length > 0) {
                        alert(
                          "Por favor, describa la novedad de todos los equipos marcados"
                        );
                        return;
                      }

                      const novedadGeneral =
                        document.getElementById("novedadGeneral")?.value ||
                        null;
                      handleProcesarDevolucion(novedadGeneral);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold flex items-center gap-2"
                  >
                    <Check size={20} />
                    Confirmar Devolución
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* 👇 NUEVO: Modal para agregar novedades por CONSUMIBLE al DEVOLVER */}
      {showNovedadesConsumiblesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-4xl mx-4 max-h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    Confirmar Devolución de Productos Consumibles
                  </h3>
                  <p className="text-green-100 text-sm">
                    Revise cada producto y registre la cantidad devuelta
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowNovedadesConsumiblesModal(false);
                    setConsumiblesConDetalles([]);
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8 overflow-y-auto max-h-[calc(85vh-250px)]">
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-yellow-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Indique la cantidad devuelta
                      de cada producto. Puede ser diferente a la cantidad
                      asignada si se consumió parte del producto.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {consumiblesConDetalles.map((consumible, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-5 transition-all duration-200 ${
                      consumible.TieneNovedad
                        ? "bg-red-50 border-red-300 shadow-md"
                        : "bg-gray-50 border-gray-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          consumible.TieneNovedad
                            ? "bg-red-100"
                            : "bg-green-100"
                        }`}
                      >
                        {consumible.TieneNovedad ? (
                          <AlertCircle size={24} className="text-red-600" />
                        ) : (
                          <Check size={24} className="text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-lg text-gray-800">
                            {consumible.Nombre}
                          </h4>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Asignado: {consumible.CantidadAsignada}
                          </span>
                        </div>

                        {/* Mostrar observación inicial si existe */}
                        {consumible.ObservacionInicial && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-700 mb-1">
                              OBSERVACIÓN AL ENTREGAR:
                            </p>
                            <p className="text-sm text-blue-900">
                              {consumible.ObservacionInicial}
                            </p>
                          </div>
                        )}

                        {/* Campo de cantidad devuelta */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad Devuelta{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={consumible.CantidadDevuelta}
                            onChange={(e) => {
                              const valor = parseInt(e.target.value) || 0;
                              if (valor <= consumible.CantidadAsignada) {
                                handleUpdateNovedadConsumible(
                                  consumible.IdProductoConsumible,
                                  consumible.TieneNovedad,
                                  consumible.NovedadDevolucion,
                                  valor
                                );
                              }
                            }}
                            min="0"
                            max={consumible.CantidadAsignada}
                            className="w-full border-2 border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Máximo: {consumible.CantidadAsignada} unidades
                          </p>
                        </div>

                        {/* Checkbox para marcar si tiene novedad */}
                        <div className="mb-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={consumible.TieneNovedad}
                              onChange={(e) =>
                                handleUpdateNovedadConsumible(
                                  consumible.IdProductoConsumible,
                                  e.target.checked,
                                  consumible.NovedadDevolucion,
                                  consumible.CantidadDevuelta
                                )
                              }
                              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                            />
                            <span className="font-medium text-gray-700">
                              Este producto presenta alguna novedad
                            </span>
                          </label>
                        </div>

                        {/* Textarea para descripción de novedad */}
                        {consumible.TieneNovedad && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Descripción de la Novedad{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={consumible.NovedadDevolucion || ""}
                              onChange={(e) =>
                                handleUpdateNovedadConsumible(
                                  consumible.IdProductoConsumible,
                                  true,
                                  e.target.value,
                                  consumible.CantidadDevuelta
                                )
                              }
                              className="w-full border-2 border-red-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                              placeholder="Describa detalladamente la novedad..."
                              rows={3}
                              maxLength={500}
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1 text-right">
                              {consumible.NovedadDevolucion?.length || 0}/500
                              caracteres
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Novedad general (opcional) */}
              <div className="mt-6 p-5 bg-gray-100 border border-gray-300 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observación General de la Devolución (Opcional)
                </label>
                <textarea
                  id="novedadGeneralConsumibles"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Puede agregar comentarios generales sobre la devolución..."
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  <strong>
                    {
                      consumiblesConDetalles.filter((c) => c.TieneNovedad)
                        .length
                    }
                  </strong>{" "}
                  de <strong>{consumiblesConDetalles.length}</strong> productos
                  con novedades
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNovedadesConsumiblesModal(false);
                      setConsumiblesConDetalles([]);
                    }}
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      // Validar novedades
                      const consumiblesConNovedadSinDescripcion =
                        consumiblesConDetalles.filter(
                          (c) => c.TieneNovedad && !c.NovedadDevolucion?.trim()
                        );

                      if (consumiblesConNovedadSinDescripcion.length > 0) {
                        alert(
                          "Por favor, describa la novedad de todos los productos marcados"
                        );
                        return;
                      }

                      const novedadGeneral =
                        document.getElementById("novedadGeneralConsumibles")
                          ?.value || null;
                      handleProcesarDevolucionConsumibles(novedadGeneral);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold flex items-center gap-2"
                  >
                    <Check size={20} />
                    Confirmar Devolución
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
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
      )}{" "}
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
                    <div className="flex items-center justify-between">
                      <div className="bg-green-100 text-green-800 px-4 py-3 rounded-full font-bold text-2xl shadow-md">
                        {selectedAsignacion.Cantidad}
                      </div>
                      <button
                        onClick={() => handleShowEquipments(selectedAsignacion)}
                        className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold text-sm shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        {selectedAsignacion.Item === "Equipo Tecnologico"
                          ? "Ver Equipos"
                          : "Ver Detalles de Productos"}
                      </button>
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
              {/* Solo Ambiente en Información Adicional */}
              <div className="bg-gray-100 rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  Ambiente
                </h4>

                <div className="grid grid-cols-1 gap-6">
                  {/* Solo Ambiente */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                    <label className="text-sm font-medium text-gray-600 mb-3 flex items-center"></label>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-gray-900 font-bold text-lg">
                        {(() => {
                          // Primero verificar si hay campos separados de ambiente
                          if (selectedAsignacion.Ambiente) {
                            return (
                              <>
                                <span className="block mb-2">
                                  {selectedAsignacion.Ambiente}
                                </span>
                                {selectedAsignacion.CodigoAmbiente && (
                                  <span className="text-sm font-semibold text-green-600 bg-green-200 px-3 py-1 rounded-full">
                                    Código: {selectedAsignacion.CodigoAmbiente}
                                  </span>
                                )}
                              </>
                            );
                          }

                          // Si no, intentar extraer de la observación (compatibilidad con registros antiguos)
                          const observacion =
                            selectedAsignacion.Observacion || "";
                          const ambienteMatch = observacion.match(
                            /Asignado en (.+?) \(Código: (\d+)\)/
                          );

                          if (ambienteMatch) {
                            return (
                              <>
                                <span className="block mb-2">
                                  {ambienteMatch[1]}
                                </span>
                                <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                  Código: {ambienteMatch[2]}
                                </span>
                              </>
                            );
                          }

                          return (
                            <span className="text-gray-400 italic">
                              No especificado
                            </span>
                          );
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
      )}{" "}
      {/* Modal para mostrar equipos con detalles completos */}
      {showEquipmentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {selectedAsignacion?.Item === "Equipo Tecnologico"
                      ? "Equipos Tecnológicos - Detalles Completos"
                      : "Productos Consumibles - Detalles Completos"}
                  </h3>
                  <p className="text-green-100 text-sm">
                    Información detallada de cada{" "}
                    {selectedAsignacion?.Item === "Equipo Tecnologico"
                      ? "equipo"
                      : "producto"}
                  </p>
                </div>
                <button
                  onClick={() => setShowEquipmentsModal(false)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8 overflow-y-auto max-h-[calc(80vh-180px)]">
              {selectedEquipments && selectedEquipments.length > 0 ? (
                <div className="space-y-4">
                  {selectedAsignacion?.Item === "Equipo Tecnologico"
                    ? // 👇 VISTA PARA EQUIPOS TECNOLÓGICOS
                      selectedEquipments.map((equipment, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-xl text-gray-800">
                                  Equipo #{index + 1}
                                </h4>
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-mono font-bold">
                                  {equipment.CodigoEquipo || equipment}
                                </span>
                              </div>

                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText
                                    size={16}
                                    className="text-green-600"
                                  />
                                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Observación al Prestar:
                                  </span>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <p className="text-gray-800 text-sm">
                                    {equipment.ObservacionInicial || (
                                      <span className="text-gray-400 italic">
                                        Sin observaciones registradas
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertCircle
                                    size={16}
                                    className="text-red-600"
                                  />
                                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Novedad en la Devolución:
                                  </span>
                                </div>
                                <div
                                  className={`rounded-lg p-3 border ${
                                    equipment.NovedadDevolucion
                                      ? "bg-red-50 border-red-200"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <p
                                    className={`text-sm ${
                                      equipment.NovedadDevolucion
                                        ? "text-red-900 font-medium"
                                        : "text-gray-400 italic"
                                    }`}
                                  >
                                    {equipment.NovedadDevolucion ||
                                      "Sin novedades reportadas"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : // 👇 VISTA PARA PRODUCTOS CONSUMIBLES
                      selectedEquipments.map((consumible, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-xl text-gray-800">
                                  {consumible.ProductoConsumible?.Nombre ||
                                    "Producto"}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                                    Asignado: {consumible.CantidadAsignada}
                                  </span>
                                  {consumible.CantidadDevuelta !== null && (
                                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                                      Devuelto: {consumible.CantidadDevuelta}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText
                                    size={16}
                                    className="text-green-600"
                                  />
                                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Observación al Entregar:
                                  </span>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                  <p className="text-gray-800 text-sm">
                                    {consumible.ObservacionInicial || (
                                      <span className="text-gray-400 italic">
                                        Sin observaciones registradas
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertCircle
                                    size={16}
                                    className="text-red-600"
                                  />
                                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                    Novedad en la Devolución:
                                  </span>
                                </div>
                                <div
                                  className={`rounded-lg p-3 border ${
                                    consumible.NovedadDevolucion
                                      ? "bg-red-50 border-red-200"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  <p
                                    className={`text-sm ${
                                      consumible.NovedadDevolucion
                                        ? "text-red-900 font-medium"
                                        : "text-gray-400 italic"
                                    }`}
                                  >
                                    {consumible.NovedadDevolucion ||
                                      "Sin novedades reportadas"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto mb-4 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-lg font-medium">
                    No hay{" "}
                    {selectedAsignacion?.Item === "Equipo Tecnologico"
                      ? "equipos"
                      : "productos"}{" "}
                    registrados
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  <strong>{selectedEquipments?.length || 0}</strong>{" "}
                  {selectedAsignacion?.Item === "Equipo Tecnologico"
                    ? "equipo(s)"
                    : "producto(s)"}{" "}
                  en total
                </p>
                <button
                  onClick={() => setShowEquipmentsModal(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Panel lateral de selección de ambientes */}
      {showAmbientesPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-600 text-white p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Seleccionar Ambiente</h3>
                <button
                  onClick={() => {
                    setShowAmbientesPanel(false);
                    setAmbienteSearchTerm("");
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por código o nombre..."
                  value={ambienteSearchTerm}
                  onChange={(e) => setAmbienteSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-white bg-white bg-opacity-20 backdrop-blur-sm text-white placeholder-white placeholder-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-3.5 text-white opacity-70"
                />
                {ambienteSearchTerm && (
                  <button
                    onClick={() => setAmbienteSearchTerm("")}
                    className="absolute right-3 top-3.5 text-white hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {filteredAmbientes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="mb-4">
                    <Search size={48} className="mx-auto text-gray-300" />
                  </div>
                  <p className="text-lg">No se encontraron ambientes</p>
                </div>
              ) : (
                filteredAmbientes.map((ambiente) => (
                  <div
                    key={ambiente.idAmbiente || ambiente.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-green-500 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => handleSelectAmbiente(ambiente)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-green-100 text-green-600 rounded-lg p-2 group-hover:bg-green-600 group-hover:text-white transition-colors duration-200">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              Código: {ambiente.codigo}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors duration-200">
                          {ambiente.nombre}
                        </h4>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              ambiente.estado === "Disponible"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {ambiente.estado || "Disponible"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAmbiente(ambiente);
                        }}
                        className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* 👇 NUEVO: Panel lateral de selección de productos consumibles */}
      {showConsumiblesPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-600 text-white p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Seleccionar Productos</h3>
                <button
                  onClick={() => {
                    setShowConsumiblesPanel(false);
                    setConsumibleSearchTerm("");
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={consumibleSearchTerm}
                  onChange={(e) => setConsumibleSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-white bg-white bg-opacity-20 backdrop-blur-sm text-white placeholder-white placeholder-opacity-70 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-3.5 text-white opacity-70"
                />
                {consumibleSearchTerm && (
                  <button
                    onClick={() => setConsumibleSearchTerm("")}
                    className="absolute right-3 top-3.5 text-white hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {filteredConsumibles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="mb-4">
                    <Search size={48} className="mx-auto text-gray-300" />
                  </div>
                  <p className="text-lg">
                    No se encontraron productos disponibles
                  </p>
                </div>
              ) : (
                filteredConsumibles.map((producto) => (
                  <div
                    key={producto.IdProductosConsumibles}
                    className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-green-500 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 mb-2">
                          {producto.Nombre}
                        </h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            {producto.UnidadMedida} de {producto.ValorMedida}
                          </span>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              producto.CantidadDisponible > 10
                                ? "bg-green-100 text-green-800"
                                : producto.CantidadDisponible > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            Stock: {producto.CantidadDisponible}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Cantidad"
                        min="1"
                        max={producto.CantidadDisponible}
                        id={`cantidad-${producto.IdProductosConsumibles}`}
                        className="flex-1 border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(
                            `cantidad-${producto.IdProductosConsumibles}`
                          );
                          const cantidad = parseInt(input.value) || 0;
                          handleSelectConsumible(producto, cantidad);
                          input.value = "";
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg whitespace-nowrap"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))
              )}
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
