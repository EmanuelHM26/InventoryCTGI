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
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      Codigo: "",
      Nombre: "",
      Marca: "",
      Modelo: "",
      Estado: "Activo" // Valor por defecto
    }
  });

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/equipostecnologicos",
        { withCredentials: true }
      );
      setEquipos(response.data);
    } catch (error) {
      console.error("Error al obtener equipos tecnológicos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los equipos tecnológicos",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar si el código ya existe
  const checkCodigoExists = async (codigo, excludeId = null) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/equipostecnologicos",
        { withCredentials: true }
      );
      const equipos = response.data;
      const equipoExistente = equipos.find(
        equipo => 
          equipo.Codigo === codigo && 
          equipo.idequipostecnologicos !== excludeId
      );
      return !!equipoExistente;
    } catch (error) {
      console.error("Error al verificar código:", error);
      return false;
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const equipoId = watch('idequipostecnologicos');
      const codigo = data.Codigo.trim();

      // Verificar si el código ya existe (excepto para el equipo actual en edición)
      const codigoExiste = await checkCodigoExists(codigo, equipoId);
      
      if (codigoExiste) {
        setError('Codigo', {
          type: 'manual',
          message: 'Este código ya está en uso. Por favor ingrese un código único.'
        });
        setLoading(false);
        return;
      }

      // Limpiar error de código si existe
      clearErrors('Codigo');

      const equipoData = {
        Codigo: codigo,
        Nombre: data.Nombre.trim(),
        Marca: data.Marca.trim(),
        Modelo: data.Modelo.trim(),
        Estado: data.Estado || "Activo"
        // Se eliminaron IdCodigoBarras e IdEstado
      };

      if (equipoId) {
        // Modo edición
        await axios.put(
          `http://localhost:3000/api/equipostecnologicos/${equipoId}`,
          equipoData,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El equipo se actualizó correctamente.",
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        // Modo creación
        await axios.post(
          "http://localhost:3000/api/equipostecnologicos",
          equipoData,
          { withCredentials: true }
        );
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El equipo se creó correctamente.",
          showConfirmButton: false,
          timer: 2000
        });
      }
      
      handleCloseModal();
      fetchEquipos();
    } catch (error) {
      console.error("Error al guardar equipo:", error);
      
      let errorMessage = "Ocurrió un error al guardar el equipo.";
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Datos inválidos. Verifique la información.";
      } else if (error.response?.status === 409) {
        errorMessage = "El código del equipo ya existe. Por favor use un código único.";
      } else if (error.response?.status === 500) {
        errorMessage = "Error del servidor. Intente nuevamente.";
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditEquipo = (equipo) => {
    reset({
      idequipostecnologicos: equipo.idequipostecnologicos,
      Codigo: equipo.Codigo || "",
      Nombre: equipo.Nombre || "",
      Marca: equipo.Marca || "",
      Modelo: equipo.Modelo || "",
      Estado: equipo.Estado || "Activo"
    });
    setShowModal(true);
  };

  const handleDeleteEquipo = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer. El equipo será eliminado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await axios.delete(
          `http://localhost:3000/api/equipostecnologicos/${id}`,
          { withCredentials: true }
        );
        
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El equipo fue eliminado correctamente.",
          showConfirmButton: false,
          timer: 1500
        });
        
        fetchEquipos();
      } catch (error) {
        console.error("Error al eliminar equipo:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "No se pudo eliminar el equipo. Puede que esté en uso.",
          showConfirmButton: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsScanning(false);
    reset();
    clearErrors();
  };

  const handleBarcodeScanned = (barcode) => {
    if (barcode && barcode.trim() !== '') {
      const codigoLimpio = barcode.trim();
      setValue('Codigo', codigoLimpio);
      setIsScanning(false);
      
      // Validar inmediatamente si el código existe
      checkCodigoExists(codigoLimpio).then(existe => {
        if (existe) {
          setError('Codigo', {
            type: 'manual',
            message: 'Este código ya está en uso. Escanee otro código.'
          });
          Swal.fire({
            icon: 'warning',
            title: 'Código Duplicado',
            text: `El código ${codigoLimpio} ya existe. Use un código único.`,
            timer: 3000,
            showConfirmButton: false
          });
        } else {
          clearErrors('Codigo');
          Swal.fire({
            icon: 'success',
            title: 'Código Escaneado',
            text: `Código: ${codigoLimpio}`,
            timer: 1500,
            showConfirmButton: false
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de Escaneo',
        text: 'No se pudo leer el código. Inténtelo de nuevo.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleNewEquipo = () => {
    reset({
      Codigo: "",
      Nombre: "",
      Marca: "",
      Modelo: "",
      Estado: "Activo"
    });
    clearErrors();
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
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (equipo.Nombre?.toLowerCase().includes(searchTermLower)) ||
      (equipo.Marca?.toLowerCase().includes(searchTermLower)) ||
      (equipo.Modelo?.toLowerCase().includes(searchTermLower)) ||
      (equipo.Codigo?.toString().toLowerCase().includes(searchTermLower)) ||
      (equipo.Estado?.toLowerCase().includes(searchTermLower))
    );
  });

  const sortedEquipos = [...filteredEquipos].sort((a, b) => {
    if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
    if (!a[sortConfig.key]) return 1;
    if (!b[sortConfig.key]) return -1;
    
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
  };
};