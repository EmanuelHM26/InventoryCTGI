import BarcodeReader from "./BarcodeReader";
import { FileText, Download } from "lucide-react";
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
import { useReservas } from "../hooks/useReservas";

const Reservas = () => {
  const {
    usuarios,
    activeTab,
    showModal,
    setShowModal,
    newReserva,
    setNewReserva,
    currentPage,
    searchTerm,
    setSearchTerm,
    barcodeMode,
    setBarcodeMode,
    scannedEquipment,
    setScannedEquipment,
    showBarcodeInstructions,
    setShowBarcodeInstructions,
    handleCreateReserva,
    handleEditReserva,
    handleDeleteReserva,
    handleCheckReservaFija,
    formatDate,
    requestSort,
    sortedReservas,
    indexOfFirstItem,
    indexOfLastItem,
    currentReservas,
    totalPages,
    paginate,
    handleTabChange,
    handleBarcodeScan,
    getTableHeaders,
    exportToPDF,
    exportToExcel,
    inputErrors,
    setInputErrors,
    //equiposTecnologicos,
    showEquiposModal,
    setShowEquiposModal,
    selectedReservaEquipos,
    handleShowEquipos,
  } = useReservas();

  // Función para obtener la fecha mínima (hoy)
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const validateField = (field, value) => {
  const trimmed = value.trimStart();
  switch (field) {
    case "nombrePrograma":
      if (!trimmed) return "El nombre del programa es requerido";
      if (/^\s/.test(value)) return "No puede comenzar con espacio";
      if (!/^[A-Za-z ]+$/.test(value)) return "Solo letras y espacios";
      break;
    case "ficha":
      if (!value) return "La ficha es requerida";
      if (!/^[0-9]+$/.test(value)) return "Solo se permiten números";
      break;
    case "materialReservado":
      if (!trimmed) return "El material es requerido";
      if (/^\s/.test(value)) return "No puede comenzar con espacio";
      if (!/^[A-Za-z0-9, ]+$/.test(value)) return "Solo letras, números y comas";
      break;
    case "IdUsuario":
      if (!value) return "Debe seleccionar un usuario";
      break;
    case "fecha":{
      if (!value) return "La fecha es requerida";
      const fechaSeleccionada = new Date(value);
      const fechaHoy = new Date();
      fechaHoy.setHours(0, 0, 0, 0);
      if (fechaSeleccionada < fechaHoy) return "No se pueden seleccionar fechas pasadas";
      break;}
    default:
      return "";
  }
  return "";
};
  
//También puedes agregar una función para limpiar equipos escaneados:
const removeScannedEquipment = (codeToRemove) => {
  const nuevosEquipos = scannedEquipment.filter(eq => eq.code !== codeToRemove);
  setScannedEquipment(nuevosEquipos);
  
  // Actualizar el campo materialReservado
  const codigosEscaneados = nuevosEquipos.map(eq => eq.code).join(', ');
  setNewReserva(prev => ({
    ...prev,
    materialReservado: codigosEscaneados
  }));
};


   

  const getFormFields = () => {
    if (activeTab === "fijas") {
      return (
        <>
          {/* Nombre del Programa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Programa
            </label>
            <input
              type="text"
              value={newReserva.nombrePrograma || ""}
              onChange={(e) => {
                const value = e.target.value;
                setNewReserva(prev => ({ ...prev, nombrePrograma: value }));
                setInputErrors(prev => ({
                  ...prev,
                  nombrePrograma: validateField("nombrePrograma", value)
                }));
              }}
              placeholder="Ingrese el nombre del programa"
              className={`border p-2 rounded-lg w-full ${
                inputErrors.nombrePrograma ? "border-red-500" : "border-gray-300"
              }`}
            />
            {inputErrors.nombrePrograma && (
              <span className="text-red-500 text-xs">
                {inputErrors.nombrePrograma}
              </span>
            )}
          </div>

          {/* Ficha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ficha
            </label>
            <input
              type="text"
              value={newReserva.ficha || ""}
              onChange={(e) => {
                const value = e.target.value;
                setNewReserva({ ...newReserva, ficha: value });
                setInputErrors((prev) => ({
                  ...prev,
                  ficha: validateField("ficha", value),
                }));
              }}
              placeholder="Ingrese el número de ficha"
              className={`border p-2 rounded-lg w-full ${
                inputErrors.ficha ? "border-red-500" : "border-gray-300"
              }`}
            />
            {inputErrors.ficha && (
              <span className="text-red-500 text-xs">{inputErrors.ficha}</span>
            )}
          </div>

          {/* Material Reservado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Reservado
            </label>
            <input
              type="text"
              value={newReserva.materialReservado || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/^\s+/, "");
                setNewReserva({ ...newReserva, materialReservado: value });
                setInputErrors((prev) => ({
                  ...prev,
                  materialReservado: validateField("materialReservado", value),
                }));
              }}
              placeholder="Escriba manualmente o use el escáner"
              className={`border p-2 rounded-lg w-full ${
                inputErrors.materialReservado ? "border-red-500" : "border-gray-300"
              }`}
            />
            {inputErrors.materialReservado && (
              <span className="text-red-500 text-xs">
                {inputErrors.materialReservado}
              </span>
            )}
          </div>
        </>
      );
    } else {
      return (
        <>
          {/* Escaneo y materiales escaneados */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2 mb-2">
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
                Escanear Material
              </button>
              <span className="ml-2 text-sm text-gray-500">
                Modo actual:
                <span
                  className={`ml-1 ${
                    barcodeMode === "user" ? "text-blue-600" : "text-green-600"
                  }`}
                >
                  {barcodeMode === "user"
                    ? "Escaneando Usuario"
                    : "Escaneando Material"}
                </span>
              </span>
            </div>
            {showBarcodeInstructions && (
              <p className="text-xs mt-1 text-blue-600 animate-pulse">
                {barcodeMode === "user"
                  ? "Escanee el documento del usuario..."
                  : "Escanee los códigos de los materiales..."}
              </p>
            )}
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <select
              value={newReserva.IdUsuario || ""}
              onChange={(e) => {
                const value = e.target.value;
                setNewReserva({ ...newReserva, IdUsuario: value });
                setInputErrors((prev) => ({
                  ...prev,
                  IdUsuario: validateField("IdUsuario", value),
                }));
              }}
              className={`border p-2 rounded-lg w-full ${
                inputErrors.IdUsuario ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione un usuario</option>
              {usuarios.map((u) => (
                <option key={u.IdUsuario} value={u.IdUsuario}>
                  {u.Usuario}
                </option>
              ))}
            </select>
            {inputErrors.IdUsuario && (
              <span className="text-red-500 text-xs">{inputErrors.IdUsuario}</span>
            )}
          </div>

          {/* Ficha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ficha
            </label>
            <input
              type="text"
              value={newReserva.ficha || ""}
              onChange={(e) => {
                const value = e.target.value;
                setNewReserva({ ...newReserva, ficha: value });
                setInputErrors((prev) => ({
                  ...prev,
                  ficha: validateField("ficha", value),
                }));
              }}
              placeholder="Ingresa el número de la ficha"
              className={`border p-2 rounded-lg w-full ${
                inputErrors.ficha ? "border-red-500" : "border-gray-300"
              }`}
            />
            {inputErrors.ficha && (
              <span className="text-red-500 text-xs">{inputErrors.ficha}</span>
            )}
          </div>

          {/* Material Reservado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Reservado
            </label>
            <input
              type="text"
              value={newReserva.materialReservado || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/^\s+/, "");
                setNewReserva({ ...newReserva, materialReservado: value });
                setInputErrors((prev) => ({
                  ...prev,
                  materialReservado: validateField("materialReservado", value),
                }));
              }}
              placeholder="Escriba manualmente o use el escáner"
              className={`border p-2 rounded-lg w-full ${
                inputErrors.materialReservado ? "border-red-500" : "border-gray-300"
              }`}
            />
            {inputErrors.materialReservado && (
              <span className="text-red-500 text-xs">
                {inputErrors.materialReservado}
              </span>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={newReserva.fecha || ""}
              min={getTodayDate()}
              onChange={(e) => {
                const value = e.target.value;
                setNewReserva({ ...newReserva, fecha: value });
                setInputErrors((prev) => ({
                  ...prev,
                  fecha: validateField("fecha", value),
                }));
              }}
              className={`border p-2 rounded-lg w-full ${
                inputErrors.fecha ? "border-red-500" : "border-gray-300"
              }`}
            />
            {inputErrors.fecha && (
              <span className="text-red-500 text-xs">{inputErrors.fecha}</span>
            )}
          </div>

          {/* Materiales Escaneados */}
       {scannedEquipment.length > 0 && (
  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
    <h4 className="font-semibold text-green-900 mb-2">
      Materiales Escaneados
    </h4>
    <div className="space-y-2">
      {scannedEquipment.map((equipment, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-white p-2 rounded border"
        >
          <div className="flex flex-col">
            <span className="text-sm font-mono font-semibold">{equipment.code}</span>
            <span className="text-xs text-gray-500">
              {equipment.equipo?.Nombre || 'Sin nombre'} - {equipment.equipo?.Marca || 'Sin marca'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
              x{equipment.quantity}
            </span>
            <button
              type="button"
              onClick={() => removeScannedEquipment(equipment.code)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Eliminar equipo"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
         
        </>
      );
    }
  };

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="flex items-center mr-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Reservas de Material
            </h1>
          </div>
        </div>
        {/* Tabs and New Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex border-b border-gray-200 mb-4 md:mb-0">
            <button
              onClick={() => handleTabChange("fijas")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "fijas"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reservas Fijas
            </button>
            <button
              onClick={() => handleTabChange("diarias")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "diarias"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Reservas Diarias
            </button>
          </div>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder={`Buscar ${
                  activeTab === "fijas" ? "reserva fija" : "reserva diaria"
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
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

            {/* Botones de exportar */}
            <div className="flex gap-2">
              <button
                onClick={exportToPDF}
                className="flex items-center justify-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                title="Exportar a PDF"
              >
                <FileText size={16} className="mr-2" />
                PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
                title="Exportar a Excel"
              >
                <Download size={16} className="mr-2" />
                Excel
              </button>
            </div>

            {/* Botón Nueva Reserva */}
            <button
              onClick={() => {
                setNewReserva({});
                setShowModal(true);
              }}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Nueva Reserva
            </button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder={`Buscar ${
                activeTab === "fijas" ? "reserva fija" : "reserva diaria"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
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
        </div>
        {/* Tabla de Reservas */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {getTableHeaders().map((header, index) => (
                  <th
                    key={index}
                    onClick={() => {
                      if (index < getTableHeaders().length - 1) {
                        requestSort(header);
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      index < getTableHeaders().length - 1
                        ? "cursor-pointer hover:bg-gray-100"
                        : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReservas.length > 0 ? (
                currentReservas.map((reserva) => {
                  if (activeTab === "fijas") {
                    return (
                      <tr
                        key={reserva.idReservaFija}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.idReservaFija}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.nombrePrograma}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.ficha}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.materialReservado}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              reserva.Estado === "Disponible"
                                ? "bg-green-100 text-green-800"
                                : reserva.Estado === "Asignado"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {reserva.Estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReserva(reserva)}
                              className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                              title="Editar reserva"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReserva(reserva.idReservaFija)
                              }
                              className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                              title="Eliminar reserva"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => handleCheckReservaFija(reserva)}
                              className={`p-1 rounded-full ${
                                reserva.Estado === "Disponible"
                                  ? "bg-green-100 hover:bg-green-200 text-green-600"
                                  : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                              } transition-colors duration-200`}
                              title={
                                reserva.Estado === "Disponible"
                                  ? "Marcar como Asignado"
                                  : "Marcar como Disponible"
                              }
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        key={reserva.idReservaDiaria}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.idReservaDiaria}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.Usuario?.Usuario || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.ficha}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {reserva.materialReservado}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(reserva.fecha)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReserva(reserva)}
                              className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                              title="Editar reserva"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReserva(reserva.idReservaDiaria)
                              }
                              className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                              title="Eliminar reserva"
                            >
                              <Trash2 size={16} />
                            </button>
                            {/* Botón Ver Equipos */}
                            <button
                              onClick={() => handleShowEquipos(reserva)}
                              className="p-1 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors duration-200"
                              title="Ver equipos tecnológicos"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                })
              ) : (
                <tr>
                  <td
                    colSpan={getTableHeaders().length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron{" "}
                    {activeTab === "fijas"
                      ? "reservas fijas"
                      : "reservas diarias"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {sortedReservas.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, sortedReservas.length)} de{" "}
              {sortedReservas.length}{" "}
              {activeTab === "fijas" ? "reservas fijas" : "reservas diarias"}
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
                    : "text-gray-600 hover"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 max-h-[95vh] overflow-y-auto border border-blue-100 relative animate-fade-in">
            <button
              onClick={() => {
                setShowModal(false);
                setBarcodeMode("user");
                setScannedEquipment([]);
                setShowBarcodeInstructions(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              title="Cerrar"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center text-blue-700 mt-8">
              {activeTab === "fijas"
                ? newReserva.idReservaFija
                  ? "Editar Reserva Fija"
                  : "Crear Nueva Reserva Fija"
                : newReserva.idReservaDiaria
                ? "Editar Reserva Diaria"
                : "Crear Nueva Reserva Diaria"}
            </h2>
            <p className="text-gray-500 text-center mb-6">
              {activeTab === "fijas"
                ? "Completa los datos para la reserva fija."
                : "Completa los datos para la reserva diaria."}
            </p>
            <div className="grid grid-cols-1 gap-5 mb-6">{getFormFields()}</div>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowModal(false);
                  setBarcodeMode("user");
                  setScannedEquipment([]);
                  setShowBarcodeInstructions(false);
                }}
                className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateReserva}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      <BarcodeReader onScan={handleBarcodeScan} isActive={showModal} />

      {/* Modal de Equipos Tecnológicos */}
      {showEquiposModal && selectedReservaEquipos && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-700">
                Equipos Tecnológicos - Reserva #{selectedReservaEquipos.idReservaDiaria}
              </h2>
              <button
                onClick={() => setShowEquiposModal(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {selectedReservaEquipos.materialesEscaneados && selectedReservaEquipos.materialesEscaneados.length > 0 ? (
                selectedReservaEquipos.materialesEscaneados.map((eq, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold text-gray-700">Nombre: <span className="font-normal">{eq.equipo?.Nombre || "Sin nombre"}</span></div>
                      <div className="text-gray-600 text-sm">Código: <span className="font-mono">{eq.code}</span></div>
                      <div className="text-gray-600 text-sm">Marca: {eq.equipo?.Marca || "Sin marca"}</div>
                      <div className="text-gray-600 text-sm">Modelo: {eq.equipo?.Modelo || "Sin modelo"}</div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-lg">
                        x{eq.quantity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center">No hay equipos asignados a esta reserva.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reservas;
