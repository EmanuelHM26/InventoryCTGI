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
} from "lucide-react";
import Swal from "sweetalert2";

const EquiposTecnologicos = () => {
  const [equipos, setEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEquipo, setNewEquipo] = useState({
    Cuentadante: "",
    Nombre: "",
    Regional: "",
    Costo: "",
    Modelo: "",
    Descripcion: "",
    DescripcionActual: "",
    Tipo: "",
    Atributos: "",
    Fecha: "",
    Valor: "",
  });

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "IdEquiposTecnologicos",
    direction: "ascending",
  });
  const itemsPerPage = 8;

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/equipostecnologicos",
        { withCredentials: true }
      );
      setEquipos(response.data);
    } catch (error) {
      console.error("Error al obtener equipos tecnológicos:", error);
    }
  };

  const handleCreateEquipo = async () => {
    try {
      if (newEquipo.IdEquiposTecnologicos) {
        await axios.put(
          `http://localhost:3000/api/equipostecnologicos/${newEquipo.IdEquiposTecnologicos}`,
          newEquipo,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "Equipo actualizado",
          text: "El equipo se actualizó correctamente.",
          showConfirmButton: true,
        });
      } else {
        await axios.post(
          "http://localhost:3000/api/equipostecnologicos",
          newEquipo,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "Equipo creado",
          text: "El equipo se creó correctamente.",
          showConfirmButton: true,
        });
      }
      setShowModal(false);
      fetchEquipos();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar el equipo.",
        showConfirmButton: true,
      });
      console.error(
        newEquipo.IdEquiposTecnologicos
          ? "Error al actualizar equipo:"
          : "Error al crear equipo:",
        error
      );
    }
  };

  const handleEditEquipo = (equipo) => {
    setNewEquipo(equipo);
    setShowModal(true);
  };

  const handleDeleteEquipo = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el equipo. ¿Deseas continuar?",
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
          `http://localhost:3000/api/equipostecnologicos/${id}`,
          { withCredentials: true }
        );
        fetchEquipos();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "El equipo fue eliminado correctamente.",
          showConfirmButton: true,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar el equipo.",
          showConfirmButton: true,
        });
        console.error("Error al eliminar equipo:", error);
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

  const filteredEquipos = equipos.filter((equipo) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      equipo.Nombre?.toLowerCase().includes(searchTermLower) ||
      equipo.Regional?.toLowerCase().includes(searchTermLower) ||
      equipo.Modelo?.toLowerCase().includes(searchTermLower) ||
      equipo.Descripcion?.toLowerCase().includes(searchTermLower) ||
      equipo.DescripcionActual?.toLowerCase().includes(searchTermLower)
    );
  });

  const sortedEquipos = [...filteredEquipos].sort((a, b) => {
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
  const currentEquipos = sortedEquipos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEquipos.length / itemsPerPage);

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
              onClick={() => {
                setNewEquipo({
                  Cuentadante: "",
                  Nombre: "",
                  Regional: "",
                  Costo: "",
                  Modelo: "",
                  Descripcion: "",
                  DescripcionActual: "",
                  Tipo: "",
                  Atributos: "",
                  Fecha: "",
                  Valor: "",
                });
                setShowModal(true);
              }}
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
                  "Cuentadante",
                  "Nombre",
                  "Regional",
                  "Costo",
                  "Modelo",
                  "Descripción",
                  "Descripción Actual",
                  "Tipo",
                  "Atributos",
                  "Fecha",
                  "Valor",
                  "Acciones",
                ].map((header, index) => (
                  <th
                    key={index}
                    onClick={() => {
                      if (index < 13) {
                        const keys = [
                          "IdEquiposTecnologicos",
                          "Cuentadante",
                          "Nombre",
                          "Regional",
                          "Costo",
                          "Modelo",
                          "Descripcion",
                          "DescripcionActual",
                          "Tipo",
                          "Atributos",
                          "Fecha",
                          "Valor",
                        ];
                        requestSort(keys[index]);
                      }
                    }}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${index < 13 ? "cursor-pointer hover:bg-gray-100" : ""
                      }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEquipos.length > 0 ? (
                currentEquipos.map((equipo) => (
                  <tr
                    key={equipo.IdEquiposTecnologicos}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">{equipo.IdEquiposTecnologicos}</td>
                    <td className="px-4 py-3">{equipo.Cuentadante}</td>
                    <td className="px-4 py-3">{equipo.Nombre}</td>
                    <td className="px-4 py-3">{equipo.Regional}</td>
                    <td className="px-4 py-3">{equipo.Costo}</td>
                    <td className="px-4 py-3">{equipo.Modelo}</td>
                    <td className="px-4 py-3">{equipo.Descripcion}</td>
                    <td className="px-4 py-3">{equipo.DescripcionActual}</td>
                    <td className="px-4 py-3">{equipo.Tipo}</td>
                    <td className="px-4 py-3">{equipo.Atributos}</td>
                    <td className="px-4 py-3">{equipo.Fecha ? equipo.Fecha.substring(0,10) : ""}</td>
                    <td className="px-4 py-3">{equipo.Valor}</td>
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
                    colSpan="14"
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
              {newEquipo.IdEquiposTecnologicos
                ? "Editar Equipo"
                : "Crear Nuevo Equipo"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cuentadante
                </label>
                <input
                  type="text"
                  value={newEquipo.Cuentadante}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Cuentadante: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newEquipo.Nombre}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Nombre: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regional
                </label>
                <input
                  type="text"
                  value={newEquipo.Regional}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Regional: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo
                </label>
                <input
                  type="number"
                  value={newEquipo.Costo}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Costo: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo
                </label>
                <input
                  type="text"
                  value={newEquipo.Modelo}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Modelo: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={newEquipo.Descripcion}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Descripcion: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción Actual
                </label>
                <input
                  type="text"
                  value={newEquipo.DescripcionActual}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      DescripcionActual: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <input
                  type="text"
                  value={newEquipo.Tipo}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Tipo: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Atributos
                </label>
                <input
                  type="text"
                  value={newEquipo.Atributos}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Atributos: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={newEquipo.Fecha ? newEquipo.Fecha.substring(0, 10) : ""}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Fecha: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  value={newEquipo.Valor}
                  onChange={(e) =>
                    setNewEquipo({
                      ...newEquipo,
                      Valor: e.target.value,
                    })
                  }
                  className="border border-gray-300 p-2 rounded-lg w-full"
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
                onClick={handleCreateEquipo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {newEquipo.IdEquiposTecnologicos ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquiposTecnologicos;