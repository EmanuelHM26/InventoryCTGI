import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Check,
} from "lucide-react";
import Swal from "sweetalert2";

const Asignaciones = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showNovedadModal, setShowNovedadModal] = useState(false);
  const [selectedNovedad, setSelectedNovedad] = useState('');
  const [formTouched, setFormTouched] = useState(false);
  const [newAsignacion, setNewAsignacion] = useState({
    IdUsuario: "",
    Nombre: "",
    Apellido: "",
    Documento: "",
    FechaAsignacion: "",
    HoraAsignacion: "",
    Observacion: "",
    FechaDevolucion: "",
    HoraDevolucion: "",
    Novedad: "",
    Cantidad: "",
    Item: "",
    Estado: "Activo",
  });
  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "IdAsignaciones",
    direction: "ascending",
  });
  const itemsPerPage = 8;

  useEffect(() => {
    fetchAsignaciones();
    fetchUsuarios();
  }, []);

  const fetchAsignaciones = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/asignaciones", { withCredentials: true });
      setAsignaciones(response.data);
    } catch (error) {
      console.error("Error al obtener asignaciones:", error);
    }
  };

  // Función para obtener los usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/usuarios", { withCredentials: true });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  // Llenar automáticamente Nombre, Apellido y Documento al seleccionar usuario
  const handleUsuarioChange = (e) => {
    const selectedId = e.target.value;
    const usuario = usuarios.find((u) => u.IdUsuario.toString() === selectedId);
    setNewAsignacion({
      ...newAsignacion,
      IdUsuario: selectedId,
      Nombre: usuario ? usuario.Nombre : "",
      Apellido: usuario ? usuario.Apellido : "",
      Documento: usuario ? usuario.NumeroDocumento || "" : "",
    });
  };

  const handleCreateAsignacion = async () => {
    // Validación de campos obligatorios
    const requiredFields = {
      IdUsuario: 'Usuario',
      Nombre: 'Nombre',
      Apellido: 'Apellido',
      Documento: 'Documento',
      Observacion: 'Observación',
      Cantidad: 'Cantidad',
      Item: 'Item',
      Estado: 'Estado'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!newAsignacion[field] || (field === 'Cantidad' && newAsignacion[field] <= 0)) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: `Por favor complete los siguientes campos: ${missingFields.join(', ')}`,
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Validación de fecha de devolución
    if (newAsignacion.FechaDevolucion && newAsignacion.FechaAsignacion) {
      if (new Date(newAsignacion.FechaDevolucion) < new Date(newAsignacion.FechaAsignacion)) {
        Swal.fire({
          icon: 'warning',
          title: 'Fecha inválida',
          text: 'La fecha de devolución no puede ser anterior a la fecha de asignación.',
          confirmButtonColor: '#3085d6'
        });
        return;
      }
    }

    try {
      if (newAsignacion.IdAsignaciones) {
        await axios.put(`http://localhost:3000/api/asignaciones/${newAsignacion.IdAsignaciones}`, newAsignacion, { withCredentials: true });
        Swal.fire({ icon: "success", title: "Asignación actualizada", text: "La asignación se actualizó correctamente.", timer: 1800, showConfirmButton: false });
      } else {
        const now = new Date();
        newAsignacion.FechaAsignacion = newAsignacion.FechaAsignacion || now.toISOString().split("T")[0];
        newAsignacion.HoraAsignacion = newAsignacion.HoraAsignacion || now.toTimeString().split(" ")[0];

        await axios.post("http://localhost:3000/api/asignaciones", newAsignacion, { withCredentials: true });
        Swal.fire({ icon: "success", title: "Asignación creada", text: "La asignación se creó correctamente.", showConfirmButton: true });
      }
      setShowModal(false);
      fetchAsignaciones();
      setNewAsignacion({
        IdUsuario: "",
        Nombre: "",
        Apellido: "",
        Documento: "",
        FechaAsignacion: "",
        HoraAsignacion: "",
        Observacion: "",
        FechaDevolucion: "",
        HoraDevolucion: "",
        Novedad: "",
        Cantidad: "",
        Item: "",
        Estado: "Activo",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Ocurrió un error al guardar la asignación."
      });
      console.error(error);
    }
  };

  const handleEditAsignacion = (asignacion) => {
    Swal.fire({
      title: "¿Deseas editar esta asignación?",
      text: "Podrás modificar los datos de la asignación seleccionada.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Formatear las fechas para el input date
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setNewAsignacion({
          ...asignacion,
          FechaAsignacion: formatDateForInput(asignacion.FechaAsignacion),
          FechaDevolucion: formatDateForInput(asignacion.FechaDevolucion),
        });
        setShowModal(true);
        Swal.fire({
          icon: "info",
          title: "Modo edición",
          text: "Ahora puedes editar la asignación.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleDeleteAsignacion = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la asignación. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:3000/api/asignaciones/${id}`,
          {
            withCredentials: true,
          }
        );
        fetchAsignaciones();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La asignación fue eliminada correctamente.",
          timer: 1800,
          showConfirmButton: true,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar la asignación.",
        });
        console.error("Error al eliminar asignación:", error);
      }
    }
  };

  // Función para confirmar devolución de una asignación
  const handleConfirmarDevolucion = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Hay alguna novedad que reportar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    let novedad = "";
    if (isConfirmed) {
      const { value: texto } = await Swal.fire({
        title: "Describe la novedad",
        input: "textarea",
        inputPlaceholder: "Escribe aquí la novedad...",
        showCancelButton: true,
        confirmButtonText: "Guardar",
      });

      if (texto) {
        novedad = texto;
      } else {
        return;
      }
    }

    try {
      const now = new Date();
      const FechaDevolucion = getTodayLocal();
      // Cambiar esta línea para formato HH:MM:SS
      const HoraDevolucion = now.toTimeString().split(" ")[0].substring(0, 8);

      await axios.patch(`http://localhost:3000/api/asignaciones/${id}/confirmar-devolucion`, {
        FechaDevolucion,
        HoraDevolucion,
        Estado: "Inactivo",
        Novedad: novedad || null, // Asegurar que se envíe null si está vacío
      }, { withCredentials: true });

      await fetchAsignaciones();

      Swal.fire({
        icon: "success",
        title: "Devolución confirmada",
        text: "La devolución fue registrada exitosamente.",
        timer: 1800,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error completo:", error.response?.data); // Para debug
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al confirmar devolución."
      });
    }
  };

  // Formatear fecha para mostrar en formato legible
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString;
  };

  function getTodayLocal() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0];
  }

  const truncateText = (text, maxLength = 10) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleShowNovedad = (novedad) => {
    setSelectedNovedad(novedad || 'Sin novedad registrada');
    setShowNovedadModal(true);
  };



  // Funciones para la tabla mejorada
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAsignaciones = asignaciones.filter((asignacion) => {
    const searchTermLower = searchTerm.toLowerCase();

    if (!isNaN(searchTerm) && searchTerm.trim() !== "") {
      return asignacion.IdAsignaciones.toString() === searchTerm.trim();
    }

    const fullName = asignacion.Usuario
      ? `${asignacion.Usuario.Nombre || ""} ${asignacion.Usuario.Apellido || ""}`.toLowerCase()
      : "";

    const userName = asignacion.Usuario?.Usuario?.toLowerCase() || "";

    return (
      asignacion.Observacion?.toLowerCase().includes(searchTermLower) ||
      (asignacion.FechaAsignacion &&
        formatDate(asignacion.FechaAsignacion).includes(searchTerm)) ||
      (asignacion.FechaDevolucion &&
        formatDate(asignacion.FechaDevolucion).includes(searchTerm)) ||
      fullName.includes(searchTermLower) ||
      userName.includes(searchTermLower) ||
      asignacion.Item?.toLowerCase().includes(searchTermLower)
    );
  });

  const sortedAsignaciones = [...filteredAsignaciones].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAsignaciones = sortedAsignaciones.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedAsignaciones.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
                  FechaDevolucion: "",
                  HoraDevolucion: "",
                  Novedad: "",
                  Cantidad: "",
                  Item: "",
                  Estado: "Activo",
                });
                setShowModal(true);
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
                  "Fecha Devolución",
                  "Hora Devolución",
                  "Novedad",
                  "Cantidad",
                  "Item",
                  "Estado",
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
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.IdAsignaciones}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Usuario?.Usuario || 'N/A'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Nombre}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Apellido}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Documento}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(asignacion.FechaAsignacion)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.HoraAsignacion}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Observacion}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(asignacion.FechaDevolucion)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.HoraDevolucion}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Novedad ? (
                        <button
                          onClick={() => handleShowNovedad(asignacion.Novedad)}
                          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                          title="Click para ver novedad completa"
                        >
                          {truncateText(asignacion.Novedad)}
                        </button>
                      ) : (
                        <span className="text-gray-400">Sin novedad</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Cantidad}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Item}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <span
                        className={
                          asignacion.Estado === "Activo"
                            ? "bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold"
                            : "bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold"
                        }
                      >
                        {asignacion.Estado}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAsignacion(asignacion)}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                          title="Editar asignación"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteAsignacion(
                              asignacion.IdAsignaciones
                            )
                          }
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                          title="Eliminar asignación"
                        >
                          <Trash2 size={16} />
                        </button>
                        {asignacion.Estado === "Activo" && (
                          <button
                            onClick={() => handleConfirmarDevolucion(asignacion.IdAsignaciones)}
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
                    colSpan="15"
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

      {/* Modal para crear o editar una asignación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {newAsignacion.IdAsignaciones
                ? "Editar Asignación"
                : "Crear Nueva Asignación"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <select
                  value={newAsignacion.IdUsuario}
                  onChange={handleUsuarioChange}
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newAsignacion.IdUsuario ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                  <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
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
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newAsignacion.Nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  disabled
                  required
                />
                {!newAsignacion.Nombre && formTouched && (
                  <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
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
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newAsignacion.Apellido ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  disabled
                  required
                />
                {!newAsignacion.Apellido && formTouched && (
                  <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
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
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newAsignacion.Documento ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  disabled
                  required
                />
                {!newAsignacion.Documento && formTouched && (
                  <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
                )}
              </div>

        

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observación <span className="text-red-500">*</span>
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
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newAsignacion.Observacion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  placeholder="Ingrese una observación"
                  required
                  maxLength={500}
                />
                {!newAsignacion.Observacion && formTouched && (
                  <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
                )}
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
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newAsignacion.Cantidad || newAsignacion.Cantidad <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  min="1"
                  max="9999"
                  placeholder="Ingrese la cantidad"
                  required
                />
                {(!newAsignacion.Cantidad || newAsignacion.Cantidad <= 0) && formTouched && (
                  <p className="text-red-500 text-xs mt-1">Debe ingresar una cantidad válida (mayor a 0)</p>
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
                  className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newAsignacion.Item ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  required
                >
                  <option value="">Seleccione un item</option>
                  <option value="Equipo Tecnologico">Equipo Tecnológico</option>
                  <option value="Producto Consumible">Producto Consumible</option>
                </select>
                {!newAsignacion.Item && formTouched && (
                  <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
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
                className={`border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!newAsignacion.Estado ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                required
              >
                <option value="">Seleccione un estado</option>
                <option value="Activo">Activo</option>
              </select>
              {!newAsignacion.Estado && formTouched && (
                <p className="text-red-500 text-xs mt-1">Este campo es obligatorio</p>
              )}
            </div>

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
                  !newAsignacion.Observacion ||
                  !newAsignacion.Cantidad ||
                  newAsignacion.Cantidad <= 0 ||
                  !newAsignacion.Item ||
                  !newAsignacion.Estado
                }
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${!newAsignacion.IdUsuario ||
                  !newAsignacion.Nombre ||
                  !newAsignacion.Apellido ||
                  !newAsignacion.Documento ||
                  !newAsignacion.Observacion ||
                  !newAsignacion.Cantidad ||
                  newAsignacion.Cantidad <= 0 ||
                  !newAsignacion.Item ||
                  !newAsignacion.Estado
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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

    </div>
  );
};

export default Asignaciones;