import React, { useState, useEffect } from "react";
import axios from "axios";
import BarcodeReader from './BarcodeReader';
import { useForm } from "react-hook-form";
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
    Codigo: "",
    Nombre: "",
    Marca: "",
    Modelo: "",
  });

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "IdEquiposTecnologicos",
    direction: "ascending",
  });
  const [isScanning, setIsScanning] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchEquipos();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      Codigo: "",
      Nombre: "",
      Marca: "",
      Modelo: "",
    }
  });

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

  const onSubmit = async (data) => {
    try {
      const equipoData = {
        ...data,
        IdEquiposTecnologicos: watch('IdEquiposTecnologicos')
      };

      if (equipoData.IdEquiposTecnologicos) {
        await axios.put(
          `http://localhost:3000/api/equipostecnologicos/${equipoData.IdEquiposTecnologicos}`,
          equipoData,
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
          equipoData,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "Equipo creado",
          text: "El equipo se creó correctamente.",
          showConfirmButton: true,
        });
      }
      handleCloseModal();
      fetchEquipos();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Ocurrió un error al guardar el equipo.",
        showConfirmButton: true,
      });
      console.error("Error al guardar equipo:", error);
    }
  };

  const handleEditEquipo = (equipo) => {
    setValue('IdEquiposTecnologicos', equipo.IdEquiposTecnologicos);
    setValue('Codigo', equipo.Codigo);
    setValue('Nombre', equipo.Nombre);
    setValue('Marca', equipo.Marca);
    setValue('Modelo', equipo.Modelo);
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
          showConfirButton: true,
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

  const handleCloseModal = () => {
    setShowModal(false);
    setIsScanning(false);
    reset();
  };

  const handleBarcodeScanned = (barcode) => {
    console.log('Código recibido del escáner:', barcode); // Para debugging

    if (barcode && barcode.trim() !== '') {
      setValue('Codigo', barcode.trim());
      setIsScanning(false);

      // Mostrar confirmación visual
      Swal.fire({
        icon: 'success',
        title: 'Código Escaneado',
        text: `Código: ${barcode}`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      // Si el código está vacío, mostrar error
      Swal.fire({
        icon: 'error',
        title: 'Error de Escaneado',
        text: 'No se pudo leer el código. Inténtalo de nuevo.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };
  
  const handleNewEquipo = () => {
    reset();
    setShowModal(true);
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
      equipo.Marca?.toLowerCase().includes(searchTermLower) ||
      equipo.Modelo?.toLowerCase().includes(searchTermLower) ||
      equipo.Codigo?.toString().includes(searchTermLower)
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
              {currentEquipos.length > 0 ? (
                currentEquipos.map((equipo) => (
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
                  onScan={(barcode) => {
                    console.log('Código escaneado:', barcode); // Para debugging
                    handleBarcodeScanned(barcode);
                  }}
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