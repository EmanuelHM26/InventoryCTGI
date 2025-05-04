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
  ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const DetalleAsignacion = () => {
  const { idAsignacion } = useParams();
  const navigate = useNavigate();
  const [detalles, setDetalles] = useState([]);
  const [items, setItems] = useState([]); // Para dropdown de items
  const [asignacion, setAsignacion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newDetalle, setNewDetalle] = useState({
    IdAsignaciones: idAsignacion,
    IdItem: "",
    Cantidad: "",
    IdOriginal: "",
  });

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "IdDetalleAsignacion",
    direction: "ascending",
  });
  const itemsPerPage = 8;

  useEffect(() => {
    fetchDetalles();
    fetchItems();
    fetchAsignacion();
  }, [idAsignacion]);

  const fetchDetalles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/detalle-asignacion/asignacion/${idAsignacion}`,
        {
          withCredentials: true,
        }
      );
      console.log("Detalles obtenidos:", response.data); // Añade este log para depuración
      setDetalles(response.data);
    } catch (error) {
      console.error("Error al obtener detalles de asignación:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/items", {
        withCredentials: true,
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error al obtener items:", error);
    }
  };

  const fetchAsignacion = async () => {
    try {
      // Obtener la fecha de la asignación para la clave primaria compuesta
      const asignacionesResponse = await axios.get(
        "http://localhost:3000/api/asignaciones",
        {
          withCredentials: true,
        }
      );

      const asignacionEncontrada = asignacionesResponse.data.find(
        (a) => a.IdAsignaciones.toString() === idAsignacion
      );

      if (asignacionEncontrada) {
        const fechaAsignacion = asignacionEncontrada.FechaAsignacion;

        const response = await axios.get(
          `http://localhost:3000/api/asignaciones/${idAsignacion}/${fechaAsignacion}`,
          {
            withCredentials: true,
          }
        );
        setAsignacion(response.data);
      }
    } catch (error) {
      console.error("Error al obtener información de la asignación:", error);
    }
  };

  const handleCreateDetalle = async () => {
    try {
      if (newDetalle.IdDetalleAsignacion) {
        await axios.put(
          `http://localhost:3000/api/detalle-asignacion/${newDetalle.IdDetalleAsignacion}`,
          newDetalle,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/detalle-asignacion",
          newDetalle,
          {
            withCredentials: true,
          }
        );
      }
      setShowModal(false);
      fetchDetalles();
    } catch (error) {
      console.error(
        newDetalle.IdDetalleAsignacion
          ? "Error al actualizar detalle:"
          : "Error al crear detalle:",
        error
      );
    }
  };

  const handleEditDetalle = (detalle) => {
    setNewDetalle(detalle);
    setShowModal(true);
  };

  const handleDeleteDetalle = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este detalle?")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/detalle-asignacion/${id}`,
          {
            withCredentials: true,
          }
        );
        fetchDetalles();
      } catch (error) {
        console.error("Error al eliminar detalle:", error);
      }
    }
  };

  // Funciones para la tabla mejorada
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredDetalles = detalles.filter((detalle) => {
    return (
      detalle.IdDetalleAsignacion.toString().includes(searchTerm) ||
      detalle.Cantidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detalle.IdOriginal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (detalle.Item &&
        detalle.Item.Nombre &&
        detalle.Item.Nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const sortedDetalles = [...filteredDetalles].sort((a, b) => {
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
  const currentDetalles = sortedDetalles.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedDetalles.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="px-4 py-20 md:px-8 lg:px-10 max-w-full bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <button
              onClick={() => navigate("/dashboard/asignaciones")}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft size={18} className="mr-1" />
              Volver a Asignaciones
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Detalles de Asignación #{idAsignacion}
            </h1>
            {asignacion && (
              <p className="text-gray-600 mt-1">
                Usuario: {asignacion.Usuario?.Nombre}{" "}
                {asignacion.Usuario?.Apellido} | Fecha:{" "}
                {new Date(asignacion.FechaAsignacion).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar detalle..."
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
                setNewDetalle({
                  IdAsignaciones: idAsignacion,
                  IdItem: "",
                  Cantidad: "",
                  IdOriginal: "",
                });
                setShowModal(true);
              }}
              className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} className="mr-2" />
              Nuevo Detalle
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["ID", "Ítem", "Cantidad", "ID Original", "Acciones"].map(
                  (header, index) => (
                    <th
                      key={index}
                      onClick={() => {
                        if (index < 4) {
                          const keys = [
                            "IdDetalleAsignacion",
                            "IdItem",
                            "Cantidad",
                            "IdOriginal",
                          ];
                          requestSort(keys[index]);
                        }
                      }}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        index < 4 ? "cursor-pointer hover:bg-gray-100" : ""
                      }`}
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDetalles.length > 0 ? (
                currentDetalles.map((detalle) => (
                  <tr
                    key={detalle.IdDetalleAsignacion}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {detalle.IdDetalleAsignacion}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {detalle.Item?.Nombre || `Item #${detalle.IdItem}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {detalle.Cantidad}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {detalle.IdOriginal}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditDetalle(detalle)}
                          className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
                          title="Editar detalle"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteDetalle(detalle.IdDetalleAsignacion)
                          }
                          className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                          title="Eliminar detalle"
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
                    colSpan="5"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron detalles para esta asignación
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {sortedDetalles.length > 0 && (
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div>
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, sortedDetalles.length)} de{" "}
              {sortedDetalles.length} detalles
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

      {/* Modal para crear o editar un detalle */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
              {newDetalle.IdDetalleAsignacion
                ? "Editar Detalle"
                : "Crear Nuevo Detalle"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ítem
                </label>
                <select
                  value={newDetalle.IdItem}
                  onChange={(e) =>
                    setNewDetalle({
                      ...newDetalle,
                      IdItem: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione un ítem</option>
                  {items.map((item) => (
                    <option key={item.IdItem} value={item.IdItem}>
                      {item.Nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="text"
                  value={newDetalle.Cantidad}
                  onChange={(e) =>
                    setNewDetalle({
                      ...newDetalle,
                      Cantidad: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Original
                </label>
                <input
                  type="text"
                  value={newDetalle.IdOriginal}
                  onChange={(e) =>
                    setNewDetalle({
                      ...newDetalle,
                      IdOriginal: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateDetalle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {newDetalle.IdDetalleAsignacion ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleAsignacion;
