import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

export const useEquiposTecnologicos = () => {
  const [equipos, setEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "idequipostecnologicos",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const itemsPerPage = 8;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      Codigo: "",
      Nombre: "",
      Marca: "",
      Modelo: "",
    }
  });

  useEffect(() => {
    fetchEquipos();
<<<<<<< HEAD
=======
   
>>>>>>> 2593c2d1af20fda65b69a3845132f34675bf47e7
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

  const onSubmit = async (data) => {
    try {
      const equipoData = {
        ...data,
        idequipostecnologicos: watch('idequipostecnologicos')
      };

      if (equipoData.idequipostecnologicos) {
        await axios.put(
          `http://localhost:3000/api/equipostecnologicos/${equipoData.idequipostecnologicos}`,
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
    setValue('idequipostecnologicos', equipo.idequipostecnologicos);
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

  const handleCloseModal = () => {
    setShowModal(false);
    setIsScanning(false);
    reset();
  };

  const handleBarcodeScanned = (barcode) => {
    if (barcode && barcode.trim() !== '') {
      setValue('Codigo', barcode.trim());
      setIsScanning(false);
      Swal.fire({
        icon: 'success',
        title: 'Código Escaneado',
        text: `Código: ${barcode}`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
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

  // Tabla y paginación
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEquipos = sortedEquipos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedEquipos.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return {
    equipos: currentEquipos,
    showModal,
    setShowModal,
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
  };
};