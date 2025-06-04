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
  const [newAsignacion, setNewAsignacion] = useState({
    IdUsuario: "",
    FechaAsignacion: "",
    Observacion: "",
    FechaDevolucion: "",
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
      const response = await axios.get(
        "http://localhost:3000/api/asignaciones",
        {
          withCredentials: true,
        }
      );
      setAsignaciones(response.data);
    } catch (error) {
      console.error("Error al obtener asignaciones:", error);
    }
  };

  // Función para obtener los usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/usuarios",
        {
          withCredentials: true,
        }
      );
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleCreateAsignacion = async () => {
    try {
      if (newAsignacion.IdAsignaciones) {
        await axios.put(
          `http://localhost:3000/api/asignaciones/${newAsignacion.IdAsignaciones}`,
          newAsignacion,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "Asignación actualizada",
          text: "La asignación se actualizó correctamente.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await axios.post(
          "http://localhost:3000/api/asignaciones",
          newAsignacion,
          {
            withCredentials: true,
          }
        );
        Swal.fire({
          icon: "success",
          title: "Asignación creada",
          text: "La asignación se creó correctamente.",
          showConfirmButton: true,
        });
      }
      setShowModal(false);
      fetchAsignaciones();
      setNewAsignacion({
        IdUsuario: "",
        FechaAsignacion: "",
        Observacion: "",
        FechaDevolucion: "",
        Cantidad: "",
        Item: "",
        Estado: "Activo",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar la asignación.",
      });
      console.error(
        newAsignacion.IdAsignaciones
          ? "Error al actualizar asignación:"
          : "Error al crear asignación:",
        error
      );
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
    const result = await Swal.fire({
      title: "¿Confirmar devolución?",
      text: "Se establecerá la fecha actual como fecha de devolución y el estado cambiará a 'Inactivo'.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        // IMPORTANTE: Hacer la petición PATCH sin datos en el body
        const response = await axios.patch(
          `http://localhost:3000/api/asignaciones/${id}/confirmar-devolucion`,
          {}, // Body vacío - el backend maneja todo
          { withCredentials: true }
        );

        console.log('Respuesta del servidor:', response.data); // Para debug

        // Recargar las asignaciones para mostrar los cambios
        await fetchAsignaciones();

        Swal.fire({
          icon: "success",
          title: "Devolución confirmada",
          text: "La devolución se registró correctamente con la fecha actual.",
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error completo:", error.response?.data || error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Ocurrió un error al confirmar la devolución.",
        });
      }
    }
  };

  // Formatear fecha para mostrar en formato legible
  const formatDate = (dateString) => {
    if (!dateString) return "";
    // Mostrar la fecha tal cual viene (YYYY-MM-DD)
    return dateString;
  };

  function getTodayLocal() {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split('T')[0]; // Retorna la fecha en formato YYYY-MM-DD
  }

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
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
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
                  FechaAsignacion: getTodayLocal(),
                  Observacion: "",
                  FechaDevolucion: getTodayLocal(),
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
                  "Fecha Asignación",
                  "Observación",
                  "Fecha Devolución",
                  "Cantidad",
                  "Item",
                  "Estado",
                  "Acciones",
                ].map((header, index) => (
                  <th
                    key={index}
                    onClick={() => {
                      if (index < 7) {
                        const keys = [
                          "IdAsignaciones",
                          "IdUsuario",
                          "FechaAsignacion",
                          "Observacion",
                          "FechaDevolucion",
                          "Cantidad",
                          "Item",
                        ];
                        requestSort(keys[index]);
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${index < 7 ? "cursor-pointer hover:bg-gray-100" : ""
                      }`}
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.IdAsignaciones}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Usuario?.Usuario || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(asignacion.FechaAsignacion)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Observacion}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(asignacion.FechaDevolucion)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Cantidad}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {asignacion.Item}
                    </td>
                    {/* ESTADO CON COLORES */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={
                          asignacion.Estado === "Activo"
                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold"
                            : "bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold"
                        }
                      >
                        {asignacion.Estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
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
                  Usuario
                </label>
                <select
                  value={newAsignacion.IdUsuario}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      IdUsuario: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione un usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.IdUsuario} value={usuario.IdUsuario}>
                      {usuario.Nombre} {usuario.Apellido}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Asignación
                </label>
                <input
                  type="date"
                  value={newAsignacion.FechaAsignacion}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      FechaAsignacion: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Devolución
                </label>
                <input
                  type="date"
                  value={newAsignacion.FechaDevolucion}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      FechaDevolucion: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
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
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item
                </label>
                <input
                  type="text"
                  value={newAsignacion.Item}
                  onChange={(e) =>
                    setNewAsignacion({
                      ...newAsignacion,
                      Item: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={newAsignacion.Estado}
                onChange={(e) =>
                  setNewAsignacion({
                    ...newAsignacion,
                    Estado: e.target.value,
                  })
                }
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Devuelto">Devuelto</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateAsignacion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {newAsignacion.IdAsignaciones ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asignaciones;